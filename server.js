const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sarms'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to MySQL database');
        console.log("Server running on http://localhost:3000");
    }
});

// JWT secret must be supplied through the local .env file or deployment environment.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be set to a strong value of at least 32 characters in your environment.');
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Helper function to calculate age from date of birth
const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// ==================== AUTHENTICATION ROUTES ====================

// Login route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const query = 'SELECT * FROM users WHERE email = ? AND role = ?';
        db.query(query, [email, role], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Verify password with bcrypt
            const user = results[0];
            const isValidPassword = await bcrypt.compare(password, user.password);
            
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Register new student (for signup)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const role = 'student'; // Force role to be student for registration

        // Check if user already exists
        const checkQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(checkQuery, [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            const query = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
            
            db.query(query, [email, hashedPassword, role], (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Error creating user: ' + err.message });
                }
                
                // Create a token for the new user
                const token = jwt.sign(
                    { id: result.insertId, email, role },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );
                
                res.status(201).json({
                    message: 'Student registered successfully',
                    token,
                    user: { id: result.insertId, email, role }
                });
            });
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// ==================== STUDENT ROUTES ====================

// Get student profile (updated to format date of birth)
app.get('/api/student/profile', authenticateToken, (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const query = `SELECT 
                    s.*, 
                    u.email,
                    DATE_FORMAT(s.date_of_birth, '%Y-%m-%d') as formatted_dob
                  FROM students s 
                  JOIN users u ON s.user_id = u.id 
                  WHERE u.id = ?`;
                  
    db.query(query, [req.user.id], (err, results) => {
        if (err) {
            console.error('Error fetching student profile:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        
        const profile = results[0];
        
        // Format the response
        const response = {
            ...profile,
            date_of_birth: profile.formatted_dob, // Use the formatted date
            // Remove the temporary formatted_dob field from the response
            formatted_dob: undefined
        };
        
        // Remove undefined fields
        Object.keys(response).forEach(key => response[key] === undefined && delete response[key]);
        
        res.json(response);
    });
});

// Update student profile
app.put('/api/student/profile', authenticateToken, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { name, date_of_birth, address, gender, parent_guardian_name, contact_number } = req.body;
    
    // Validate required fields
    if (!name || !date_of_birth || !gender) {
        return res.status(400).json({ error: 'Name, date of birth, and gender are required' });
    }
    
    // Calculate age from date of birth
    const age = calculateAge(date_of_birth);

    try {
        // First get the student ID
        const getStudentQuery = 'SELECT id FROM students WHERE user_id = ?';
        db.query(getStudentQuery, [req.user.id], async (err, results) => {
            if (err) {
                console.error('Error getting student ID:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Student profile not found' });
            }

            const studentId = results[0].id;

            // Update the student profile
            const updateQuery = `UPDATE students 
                               SET name = ?, 
                                   date_of_birth = ?, 
                                   age = ?, 
                                   address = ?, 
                                   gender = ?, 
                                   parent_guardian_name = ?, 
                                   contact_number = ?,
                                   updated_at = NOW()
                               WHERE id = ?`;

            db.query(updateQuery, 
                [name, date_of_birth, age, address, gender, parent_guardian_name, contact_number, studentId],
                (err) => {
                    if (err) {
                        console.error('Error updating student profile:', err);
                        return res.status(500).json({ error: 'Error updating profile: ' + err.message });
                    }
                    res.json({ message: 'Profile updated successfully' });
                }
            );
        });
    } catch (error) {
        console.error('Error in profile update:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Get student institutions
app.get('/api/student/institutions', authenticateToken, (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const query = `SELECT si.*, i.name as institution_name, i.type, i.address as institution_address
                   FROM student_institutions si
                   JOIN institutions i ON si.institution_id = i.id
                   JOIN students s ON si.student_id = s.id
                   WHERE s.user_id = ?`;
    db.query(query, [req.user.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Get complete academic timeline
app.get('/api/student/academic-timeline', authenticateToken, (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const query = `SELECT ay.*, i.name as institution_name, i.type as institution_type,
                   (SELECT COUNT(*) FROM subjects WHERE academic_year_id = ay.id) as subject_count,
                   (SELECT AVG(a.attendance_percentage) FROM attendance a WHERE a.academic_year_id = ay.id) as avg_attendance
                   FROM academic_years ay
                   JOIN institutions i ON ay.institution_id = i.id
                   JOIN students s ON ay.student_id = s.id
                   WHERE s.user_id = ?
                   ORDER BY ay.academic_year`;
    
    db.query(query, [req.user.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Get academic year details with subjects and marks
app.get('/api/student/academic-year/:yearId', authenticateToken, (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const yearId = req.params.yearId;
    
    const query = `SELECT s.subject_name, s.max_marks, m.marks_obtained, m.grade, m.pass_fail, m.internal_marks
                   FROM subjects s
                   LEFT JOIN marks m ON s.id = m.subject_id
                   WHERE s.academic_year_id = ?`;
    
    db.query(query, [yearId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Get attendance for academic year
app.get('/api/student/attendance/:yearId', authenticateToken, (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const yearId = req.params.yearId;
    const query = 'SELECT * FROM attendance WHERE academic_year_id = ?';
    
    db.query(query, [yearId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results[0] || {});
    });
});

// ==================== FACULTY ROUTES ====================

// Get all students (for faculty)
app.get('/api/faculty/students', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const query = 'SELECT s.*, u.email FROM students s JOIN users u ON s.user_id = u.id';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Add new student
app.post('/api/faculty/students', authenticateToken, async (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { email, password, studentId, name, dob, address, gender, parentName, contactNumber, mentorName } = req.body;
    const age = calculateAge(dob);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userQuery = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
    db.query(userQuery, [email, hashedPassword, 'student'], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error creating user: ' + err.message });
        }

        const userId = result.insertId;
        const studentQuery = `INSERT INTO students (user_id, student_id, name, date_of_birth, age, address, 
            parent_guardian_name, contact_number, gender, mentor_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        db.query(studentQuery, [userId, studentId, name, dob, age, address, parentName, contactNumber, gender, mentorName], 
            (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error creating student: ' + err.message });
                }
                res.json({ message: 'Student added successfully' });
            });
    });
});

// Update student
app.put('/api/faculty/students/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const studentId = req.params.id;
    const { name, dob, address, gender, parentName, contactNumber, mentorName } = req.body;
    const age = calculateAge(dob);

    const query = `UPDATE students SET name = ?, date_of_birth = ?, age = ?, address = ?, 
                   parent_guardian_name = ?, contact_number = ?, gender = ?, mentor_name = ?
                   WHERE id = ?`;
    
    db.query(query, [name, dob, age, address, parentName, contactNumber, gender, mentorName, studentId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Student updated successfully' });
    });
});

// Delete student
app.delete('/api/faculty/students/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const studentId = req.params.id;
    const query = 'DELETE FROM students WHERE id = ?';
    
    db.query(query, [studentId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Student deleted successfully' });
    });
});

// Add institution
app.post('/api/faculty/institutions', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { name, type, address } = req.body;
    const query = 'INSERT INTO institutions (name, type, address) VALUES (?, ?, ?)';
    
    db.query(query, [name, type, address], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Institution added successfully', id: result.insertId });
    });
});

// Add academic year
app.post('/api/faculty/academic-years', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { studentId, institutionId, academicYear, standardClass, status } = req.body;
    const query = `INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) 
                   VALUES (?, ?, ?, ?, ?)`;
    
    db.query(query, [studentId, institutionId, academicYear, standardClass, status], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Academic year added successfully', id: result.insertId });
    });
});

// Add subject
app.post('/api/faculty/subjects', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { academicYearId, subjectName, maxMarks } = req.body;
    const query = 'INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES (?, ?, ?)';
    
    db.query(query, [academicYearId, subjectName, maxMarks], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Subject added successfully', id: result.insertId });
    });
});

// Add marks
app.post('/api/faculty/marks', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { subjectId, marksObtained, grade, passFail, internalMarks } = req.body;
    const query = `INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) 
                   VALUES (?, ?, ?, ?, ?)`;
    
    db.query(query, [subjectId, marksObtained, grade, passFail, internalMarks || 0], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Marks added successfully', id: result.insertId });
    });
});

// Add/Update attendance
app.post('/api/faculty/attendance', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { academicYearId, totalWorkingDays, daysAttended, remarks } = req.body;
    const attendancePercentage = ((daysAttended / totalWorkingDays) * 100).toFixed(2);

    // Check if attendance record exists
    const checkQuery = 'SELECT id FROM attendance WHERE academic_year_id = ?';
    db.query(checkQuery, [academicYearId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
            // Update existing record
            const updateQuery = `UPDATE attendance SET total_working_days = ?, days_attended = ?, 
                                attendance_percentage = ?, remarks = ? WHERE academic_year_id = ?`;
            db.query(updateQuery, [totalWorkingDays, daysAttended, attendancePercentage, remarks, academicYearId], 
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Database error' });
                    }
                    res.json({ message: 'Attendance updated successfully' });
                });
        } else {
            // Insert new record
            const insertQuery = `INSERT INTO attendance (academic_year_id, total_working_days, days_attended, 
                                attendance_percentage, remarks) VALUES (?, ?, ?, ?, ?)`;
            db.query(insertQuery, [academicYearId, totalWorkingDays, daysAttended, attendancePercentage, remarks], 
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: 'Database error' });
                    }
                    res.json({ message: 'Attendance recorded successfully' });
                });
        }
    });
});

// Link student to institution
app.post('/api/faculty/student-institutions', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { studentId, institutionId, startYear, endYear, mediumOfInstruction } = req.body;
    const query = `INSERT INTO student_institutions (student_id, institution_id, start_year, end_year, medium_of_instruction) 
                   VALUES (?, ?, ?, ?, ?)`;
    
    db.query(query, [studentId, institutionId, startYear, endYear, mediumOfInstruction], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Student-institution link created successfully' });
    });
});

// Get all institutions
app.get('/api/faculty/institutions', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const query = 'SELECT * FROM institutions';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Update institution
app.put('/api/faculty/institutions/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const institutionId = req.params.id;
    const { name, type, address } = req.body;
    const query = 'UPDATE institutions SET name = ?, type = ?, address = ? WHERE id = ?';
    
    db.query(query, [name, type, address, institutionId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Institution updated successfully' });
    });
});

// Delete institution
app.delete('/api/faculty/institutions/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const institutionId = req.params.id;
    const query = 'DELETE FROM institutions WHERE id = ?';
    
    db.query(query, [institutionId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Institution deleted successfully' });
    });
});

// Get all academic years (for faculty view)
app.get('/api/faculty/academic-years', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const query = `SELECT ay.*, i.name as institution_name, i.type as institution_type, 
                  u.name as student_name, u.email as student_email
                  FROM academic_years ay 
                  JOIN institutions i ON ay.institution_id = i.id
                  JOIN users u ON ay.student_id = u.id
                  ORDER BY ay.academic_year DESC, ay.standard_class`;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Get all academic years for a specific student
app.get('/api/faculty/academic-years/:studentId', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const studentId = req.params.studentId;
    const query = `SELECT ay.*, i.name as institution_name, i.type as institution_type 
                   FROM academic_years ay 
                   JOIN institutions i ON ay.institution_id = i.id 
                   WHERE ay.student_id = ? 
                   ORDER BY ay.academic_year`;
    
    db.query(query, [studentId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Update academic year
app.put('/api/faculty/academic-years/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const yearId = req.params.id;
    const { institutionId, academicYear, standardClass, status } = req.body;
    const query = `UPDATE academic_years SET institution_id = ?, academic_year = ?, 
                   standard_class = ?, status = ? WHERE id = ?`;
    
    db.query(query, [institutionId, academicYear, standardClass, status, yearId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Academic year updated successfully' });
    });
});

// Delete academic year
app.delete('/api/faculty/academic-years/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const yearId = req.params.id;
    const query = 'DELETE FROM academic_years WHERE id = ?';
    
    db.query(query, [yearId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Academic year deleted successfully' });
    });
});

// Get all subjects for an academic year (compatibility endpoint)
app.get('/api/faculty/subjects/:academicYearId', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const academicYearId = req.params.academicYearId;
    const query = `SELECT s.*, m.marks_obtained, m.grade, m.pass_fail, m.internal_marks, m.id as mark_id
                   FROM subjects s 
                   LEFT JOIN marks m ON s.id = m.subject_id 
                   WHERE s.academic_year_id = ?`;
    
    db.query(query, [academicYearId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Get all subjects for an academic year (new endpoint)
app.get('/api/faculty/academic-years/:yearId/subjects', authenticateToken, (req, res) => {
    console.log('Subjects endpoint called with yearId:', req.params.yearId);
    
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        console.log('Access denied for user role:', req.user.role);
        return res.status(403).json({ error: 'Access denied' });
    }

    const academicYearId = req.params.yearId;
    
    // First, verify the academic year exists
    db.query('SELECT id, academic_year, standard_class FROM academic_years WHERE id = ?', [academicYearId], (err, yearResults) => {
        if (err) {
            console.error('Database error checking academic year:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (yearResults.length === 0) {
            console.log('Academic year not found:', academicYearId);
            return res.status(404).json({ error: 'Academic year not found' });
        }
        
        console.log('Found academic year:', yearResults[0]);
        
        // Now get all subjects for this academic year
        const query = `
            SELECT 
                id,
                academic_year_id,
                subject_name as name,
                max_marks,
                created_at
            FROM subjects 
            WHERE academic_year_id = ?`;
        
        console.log('Executing simplified subjects query for academic year ID:', academicYearId);
        
        db.query(query, [academicYearId], (err, results) => {
            if (err) {
                console.error('Database error fetching subjects:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            console.log(`Found ${results.length} subjects for academic year ${academicYearId}`);
            
            // Return the subjects (empty array if no subjects found)
            res.json(results);
        });
    });
});

// Update subject
app.put('/api/faculty/subjects/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const subjectId = req.params.id;
    const { subjectName, maxMarks } = req.body;
    const query = 'UPDATE subjects SET subject_name = ?, max_marks = ? WHERE id = ?';
    
    db.query(query, [subjectName, maxMarks, subjectId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Subject updated successfully' });
    });
});

// Delete subject
app.delete('/api/faculty/subjects/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const subjectId = req.params.id;
    const query = 'DELETE FROM subjects WHERE id = ?';
    
    db.query(query, [subjectId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Subject deleted successfully' });
    });
});

// Update marks
app.put('/api/faculty/marks/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const markId = req.params.id;
    const { marksObtained, grade, passFail, internalMarks } = req.body;
    const query = `UPDATE marks SET marks_obtained = ?, grade = ?, pass_fail = ?, internal_marks = ? 
                   WHERE id = ?`;
    
    db.query(query, [marksObtained, grade, passFail, internalMarks || 0, markId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Marks updated successfully' });
    });
});

// Delete marks
app.delete('/api/faculty/marks/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const markId = req.params.id;
    const query = 'DELETE FROM marks WHERE id = ?';
    
    db.query(query, [markId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Marks deleted successfully' });
    });
});

// Delete attendance
app.delete('/api/faculty/attendance/:academicYearId', authenticateToken, (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const academicYearId = req.params.academicYearId;
    const query = 'DELETE FROM attendance WHERE academic_year_id = ?';
    
    db.query(query, [academicYearId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Attendance deleted successfully' });
    });
});

// ==================== ADMIN ROUTES ====================

// Get all users
app.get('/api/admin/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const query = 'SELECT id, email, role, created_at FROM users';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Generate consolidated report
app.get('/api/admin/report', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const query = `SELECT 
        COUNT(DISTINCT s.id) as total_students,
        COUNT(DISTINCT i.id) as total_institutions,
        COUNT(DISTINCT ay.id) as total_academic_years,
        AVG(a.attendance_percentage) as avg_attendance
        FROM students s
        LEFT JOIN academic_years ay ON s.id = ay.student_id
        LEFT JOIN institutions i ON ay.institution_id = i.id
        LEFT JOIN attendance a ON ay.id = a.academic_year_id`;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results[0]);
    });
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

