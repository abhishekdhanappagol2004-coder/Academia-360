/**
 * Seed random attendance records for the core 5 students.
 * Run with: node scripts/seed-student-attendance.js
 * or npm run seed:attendance
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sarms'
};

const STUDENT_ATTENDANCE_CONFIG = [
    {
        studentId: 'STU001',
        standardClass: '10th Std',
        academicYear: '2019-2020',
        status: 'Complete',
        totalDays: 215,
        remarks: 'Consistent attendance throughout the year.',
        institution: { name: 'St. Joseph Primary School', type: 'School', address: '123 Main Street, Bangalore, Karnataka' }
    },
    {
        studentId: 'STU002',
        standardClass: '12th Std',
        academicYear: '2020-2021',
        status: 'Complete',
        totalDays: 210,
        remarks: 'Improved presence in the second term.',
        institution: { name: 'Government High School', type: 'School', address: '456 Park Avenue, Bangalore, Karnataka' }
    },
    {
        studentId: 'STU003',
        standardClass: 'UG-I',
        academicYear: '2021-2022',
        status: 'Ongoing',
        totalDays: 200,
        remarks: 'Active participation in labs and tutorials.',
        institution: { name: 'ABC PU College', type: 'PU', address: '789 College Road, Bangalore, Karnataka' }
    },
    {
        studentId: 'STU004',
        standardClass: 'UG-II',
        academicYear: '2022-2023',
        status: 'Ongoing',
        totalDays: 198,
        remarks: 'Leaves taken for project work approvals.',
        institution: { name: 'XYZ Engineering College', type: 'College', address: '321 Tech Park, Bangalore, Karnataka' }
    },
    {
        studentId: 'STU005',
        standardClass: 'UG-III',
        academicYear: '2022-2023',
        status: 'Ongoing',
        totalDays: 205,
        remarks: 'Excellent punctuality record.',
        institution: { name: 'PQR University', type: 'University', address: '654 University Campus, Bangalore, Karnataka' }
    }
];

function generateAttendance(totalDays) {
    const min = 0.78;
    const max = 0.95;
    const ratio = min + Math.random() * (max - min);
    const daysAttended = Math.round(totalDays * ratio);
    const percentage = ((daysAttended / totalDays) * 100).toFixed(2);
    return { totalDays, daysAttended, percentage };
}

async function ensureInstitution(connection, institution) {
    const [rows] = await connection.execute(
        'SELECT id FROM institutions WHERE name = ? LIMIT 1',
        [institution.name]
    );
    if (rows.length > 0) {
        return rows[0].id;
    }
    const [result] = await connection.execute(
        'INSERT INTO institutions (name, type, address) VALUES (?, ?, ?)',
        [institution.name, institution.type, institution.address]
    );
    return result.insertId;
}

async function ensureAcademicYear(connection, studentDbId, institutionId, config) {
    const [rows] = await connection.execute(
        `SELECT id FROM academic_years 
         WHERE student_id = ? AND academic_year = ? AND standard_class = ? LIMIT 1`,
        [studentDbId, config.academicYear, config.standardClass]
    );
    if (rows.length > 0) {
        return rows[0].id;
    }
    const [result] = await connection.execute(
        `INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status)
         VALUES (?, ?, ?, ?, ?)`,
        [studentDbId, institutionId, config.academicYear, config.standardClass, config.status || 'Complete']
    );
    return result.insertId;
}

async function upsertAttendance(connection, academicYearId, attendance, remarks) {
    const [rows] = await connection.execute(
        'SELECT id FROM attendance WHERE academic_year_id = ? LIMIT 1',
        [academicYearId]
    );

    if (rows.length > 0) {
        await connection.execute(
            `UPDATE attendance 
             SET total_working_days = ?, days_attended = ?, attendance_percentage = ?, remarks = ?
             WHERE academic_year_id = ?`,
            [attendance.totalDays, attendance.daysAttended, attendance.percentage, remarks, academicYearId]
        );
        return { action: 'updated', id: rows[0].id };
    }

    const [result] = await connection.execute(
        `INSERT INTO attendance (academic_year_id, total_working_days, days_attended, attendance_percentage, remarks)
         VALUES (?, ?, ?, ?, ?)`,
        [academicYearId, attendance.totalDays, attendance.daysAttended, attendance.percentage, remarks]
    );
    return { action: 'inserted', id: result.insertId };
}

async function seedAttendance() {
    const connection = await mysql.createConnection(DB_CONFIG);
    console.log('🔄 Seeding attendance for core students...');

    const summary = [];

    for (const config of STUDENT_ATTENDANCE_CONFIG) {
        const [studentRows] = await connection.execute(
            'SELECT id, name FROM students WHERE student_id = ? LIMIT 1',
            [config.studentId]
        );

        if (studentRows.length === 0) {
            console.warn(`⚠️  Skipping ${config.studentId}: student record not found.`);
            continue;
        }

        const student = studentRows[0];
        const institutionId = await ensureInstitution(connection, config.institution);
        const academicYearId = await ensureAcademicYear(connection, student.id, institutionId, config);
        const attendance = generateAttendance(config.totalDays);
        const attendanceResult = await upsertAttendance(connection, academicYearId, attendance, config.remarks);

        summary.push({
            student: student.name,
            standardClass: config.standardClass,
            academicYear: config.academicYear,
            totalDays: attendance.totalDays,
            daysAttended: attendance.daysAttended,
            percentage: attendance.percentage + '%',
            action: attendanceResult.action
        });
    }

    console.table(summary);
    console.log('✅ Attendance seeding complete.');
    await connection.end();
}

seedAttendance()
    .catch((error) => {
        console.error('❌ Failed to seed attendance:', error.message);
        process.exit(1);
    });

