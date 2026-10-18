// Faculty Dashboard JavaScript

function clearSelectOptions(select, placeholderText = 'Select an option') {
    if (!select) return;
    
    // Save the current value
    const currentValue = select.value;
    
    // Clear all options
    select.innerHTML = '';
    
    // Add placeholder option
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = placeholderText;
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);
    
    // If there was a current value and it's not the placeholder, try to restore it
    if (currentValue && currentValue !== '') {
        select.value = currentValue;
    }
    
    // Trigger change event
    select.dispatchEvent(new Event('change'));
}

// API helper function
async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        ...options
    };

    try {
        const response = await fetch(`http://localhost:3000${endpoint}`, defaultOptions);
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
            window.location.href = '/login.html';
            return null;
        }
        
        return response;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

let currentPage = 'dashboard';
const academicYearCache = new Map();

function clearSelectOptions(selectElement, placeholderText = 'Select an option') {
    if (!selectElement) return;
    selectElement.innerHTML = `<option value="">${placeholderText}</option>`;
}

function populateStudentDropdown(selectElement, students, placeholderText = 'Select Student') {
    if (!selectElement) return;
    clearSelectOptions(selectElement, placeholderText);
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = `${student.student_id || 'N/A'} - ${student.name || 'Unnamed'}`;
        selectElement.appendChild(option);
    });
}

function resetAttendanceYearSelect() {
    const attendanceYearSelect = document.getElementById('attendance-year-select');
    if (attendanceYearSelect) {
        attendanceYearSelect.disabled = true;
        clearSelectOptions(attendanceYearSelect, 'Select Academic Year');
    }
}

function invalidateAcademicYearCache(studentId) {
    if (studentId) {
        academicYearCache.delete(String(studentId));
    } else {
        academicYearCache.clear();
    }
}

const attendanceStudentSelect = document.getElementById('attendance-student-select');
if (attendanceStudentSelect) {
    attendanceStudentSelect.addEventListener('change', handleAttendanceStudentChange);
}

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        showPage(page);
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

function showPage(page) {
    currentPage = page;
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        loadPageContent(page);
    }
}

async function loadPageContent(page) {
    switch(page) {
        case 'dashboard':
            await loadDashboard();
            break;
        case 'students':
            await loadStudents();
            break;
        case 'add-student':
            resetAddStudentForm();
            break;
        case 'academic-records':
            await loadAcademicRecordsForm();
            await loadAcademicYearSelects(); // Load academic years without requiring a student ID
            break;
        case 'institutions':
            await loadInstitutions();
            break;
        case 'view-records':
            await loadViewRecordsPage();
            break;
    }
}

// Load Dashboard
async function loadDashboard() {
    try {
        const [studentsRes, institutionsRes] = await Promise.all([
            apiCall('/api/faculty/students'),
            apiCall('/api/faculty/institutions')
        ]);
        
        if (studentsRes) {
            const students = await studentsRes.json();
            document.getElementById('total-students').textContent = students.length;
        }
        
        if (institutionsRes) {
            const institutions = await institutionsRes.json();
            document.getElementById('total-institutions').textContent = institutions.length;
        }
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Load Students
async function loadStudents() {
    try {
        const response = await apiCall('/api/faculty/students');
        if (!response) return;
        
        const students = await response.json();
        const container = document.getElementById('students-list');
        
        if (students.length === 0) {
            container.innerHTML = '<p>No students found.</p>';
            return;
        }
        
        let html = `
            <table class="table-container">
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Date of Birth</th>
                        <th>Gender</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        students.forEach(student => {
            html += `
                <tr>
                    <td>${student.student_id || 'N/A'}</td>
                    <td>${student.name || 'N/A'}</td>
                    <td>${student.email || 'N/A'}</td>
                    <td>${student.date_of_birth || 'N/A'}</td>
                    <td>${student.gender || 'N/A'}</td>
                    <td>
                        <button class="btn btn-primary" onclick="editStudent(${student.id})" style="padding: 5px 10px; margin-right: 5px;">Edit</button>
                        <button class="btn btn-danger" onclick="deleteStudent(${student.id})" style="padding: 5px 10px;">Delete</button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

// Add Student Form
document.getElementById('add-student-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
        studentId: formData.get('studentId'),
        name: formData.get('name'),
        dob: formData.get('dob'),
        address: formData.get('address'),
        gender: formData.get('gender'),
        parentName: formData.get('parentName'),
        contactNumber: formData.get('contactNumber'),
        mentorName: formData.get('mentorName')
    };
    
    try {
        const response = await apiCall('/api/faculty/students', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        if (response) {
            const result = await response.json();
            alert(result.message || 'Student added successfully!');
            e.target.reset();
            showPage('students');
        }
    } catch (error) {
        console.error('Error adding student:', error);
        alert('Error adding student. Please try again.');
    }
});

function resetAddStudentForm() {
    document.getElementById('add-student-form').reset();
}

async function editStudent(studentId) {
    // Load student data and populate form
    try {
        const response = await apiCall('/api/faculty/students');
        if (!response) return;
        
        const students = await response.json();
        const student = students.find(s => s.id === studentId);
        
        if (student) {
            // Populate the add form with student data
            const form = document.getElementById('add-student-form');
            form.querySelector('[name="name"]').value = student.name || '';
            form.querySelector('[name="dob"]').value = student.date_of_birth || '';
            form.querySelector('[name="address"]').value = student.address || '';
            form.querySelector('[name="gender"]').value = student.gender || '';
            form.querySelector('[name="parentName"]').value = student.parent_guardian_name || '';
            form.querySelector('[name="contactNumber"]').value = student.contact_number || '';
            form.querySelector('[name="mentorName"]').value = student.mentor_name || '';
            
            // Change form to update mode
            form.dataset.editId = studentId;
            form.querySelector('button[type="submit"]').textContent = 'Update Student';
            
            // Update form submit handler for edit mode
            form.onsubmit = async (e) => {
                e.preventDefault();
                
                const formData = new FormData(e.target);
                const data = {
                    name: formData.get('name'),
                    dob: formData.get('dob'),
                    address: formData.get('address'),
                    gender: formData.get('gender'),
                    parentName: formData.get('parentName'),
                    contactNumber: formData.get('contactNumber'),
                    mentorName: formData.get('mentorName')
                };
                
                try {
                    const updateResponse = await apiCall(`/api/faculty/students/${studentId}`, {
                        method: 'PUT',
                        body: JSON.stringify(data)
                    });
                    
                    if (updateResponse) {
                        const result = await updateResponse.json();
                        alert(result.message || 'Student updated successfully!');
                        form.reset();
                        delete form.dataset.editId;
                        form.querySelector('button[type="submit"]').textContent = 'Add Student';
                        form.onsubmit = null; // Reset to default handler
                        showPage('students');
                    }
                } catch (error) {
                    console.error('Error updating student:', error);
                    alert('Error updating student. Please try again.');
                }
            };
            
            showPage('add-student');
        }
    } catch (error) {
        console.error('Error loading student:', error);
    }
}

async function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await apiCall(`/api/faculty/students/${studentId}`, {
            method: 'DELETE'
        });
        
        if (response) {
            const result = await response.json();
            alert(result.message || 'Student deleted successfully!');
            loadStudents();
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student. Please try again.');
    }
}

// Load Academic Records Form
// Add student select change event listener
document.addEventListener('DOMContentLoaded', function() {
    const studentSelect = document.getElementById('student-select');
    if (studentSelect) {
        studentSelect.addEventListener('change', function() {
            loadAcademicYearSelects(this.value);
        });
    }
});

async function loadAcademicRecordsForm() {
    await loadStudentSelect();
    await loadInstitutionSelect();
    
    // Initialize academic years for the currently selected student
    const studentSelect = document.getElementById('student-select');
    if (studentSelect && studentSelect.value) {
        await loadAcademicYearSelects(studentSelect.value);
    } else {
        await loadAcademicYearSelects();
    }
    await loadSubjectSelect();
}

async function loadStudentSelect() {
    try {
        const response = await apiCall('/api/faculty/students');
        if (!response) return;
        
        const students = await response.json();
        populateStudentDropdown(document.getElementById('student-select'), students);
        populateStudentDropdown(document.getElementById('attendance-student-select'), students);
        resetAttendanceYearSelect();
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

async function loadInstitutionSelect() {
    try {
        const response = await apiCall('/api/faculty/institutions');
        if (!response) return;
        
        const institutions = await response.json();
        const select = document.getElementById('institution-select');
        select.innerHTML = '<option value="">Select Institution</option>';
        
        institutions.forEach(institution => {
            const option = document.createElement('option');
            option.value = institution.id;
            option.textContent = `${institution.name} (${institution.type})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading institutions:', error);
    }
}

async function loadAcademicYearSelects(studentId = null) {
    const subjectYearSelect = document.getElementById('academic-year-select');
    if (!subjectYearSelect) return;

    // Clear existing options
    clearSelectOptions(subjectYearSelect, 'Loading academic years...');
    
    try {
        let academicYears = [];
        
        if (studentId) {
            const response = await apiCall(`/api/faculty/academic-years/${studentId}`);
            if (response && response.ok) {
                academicYears = await response.json();
            }
        } else {
            // Load all academic years if no student ID is provided
            const response = await apiCall('/api/faculty/academic-years');
            if (response && response.ok) {
                academicYears = await response.json();
            }
        }

        clearSelectOptions(subjectYearSelect, 'Select Academic Year');
        
        if (academicYears.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No academic years found';
            subjectYearSelect.appendChild(option);
            return;
        }

        academicYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year.id;
            option.textContent = `${year.academic_year} - ${year.standard_class || 'Class'} (${year.status || 'Unknown'})`;
            subjectYearSelect.appendChild(option);
        });

        // Add event listener to load subjects when academic year is selected
        subjectYearSelect.addEventListener('change', (e) => {
            const selectedYearId = e.target.value;
            if (selectedYearId) {
                loadSubjectSelect(selectedYearId);
            } else {
                const subjectSelect = document.getElementById('subject-select');
                if (subjectSelect) {
                    clearSelectOptions(subjectSelect, 'Select Subject');
                }
            }
        });

        subjectYearSelect.disabled = false;
    } catch (error) {
        console.error('Error loading academic years:', error);
        clearSelectOptions(subjectYearSelect, 'Error loading academic years');
    }
    
    resetAttendanceYearSelect();
}

async function getAcademicYearsForStudent(studentId, { forceRefresh = false } = {}) {
    if (!studentId) return [];
    const cacheKey = String(studentId);
    if (!forceRefresh && academicYearCache.has(cacheKey)) {
        return academicYearCache.get(cacheKey);
    }

    const response = await apiCall(`/api/faculty/academic-years/${studentId}`);
    if (!response) return [];

    const academicYears = await response.json();
    academicYearCache.set(cacheKey, academicYears);
    return academicYears;
}

async function handleAttendanceStudentChange(event) {
    const studentId = event.target.value;
    const attendanceYearSelect = document.getElementById('attendance-year-select');
    if (!attendanceYearSelect) return;

    attendanceYearSelect.disabled = true;
    clearSelectOptions(attendanceYearSelect, studentId ? 'Loading academic years...' : 'Select Academic Year');

    if (!studentId) {
        return;
    }

    try {
        const academicYears = await getAcademicYearsForStudent(studentId);

        if (!academicYears.length) {
            clearSelectOptions(attendanceYearSelect, 'No academic years found');
            return;
        }

        clearSelectOptions(attendanceYearSelect, 'Select Academic Year');
        academicYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year.id;
            option.textContent = `${year.standard_class || 'Class'} - ${year.academic_year}`;
            attendanceYearSelect.appendChild(option);
        });
        attendanceYearSelect.disabled = false;
    } catch (error) {
        console.error('Error loading academic years for attendance:', error);
        clearSelectOptions(attendanceYearSelect, 'Error loading academic years');
    }
}

async function loadSubjectSelect(academicYearId) {
    console.log('loadSubjectSelect called with academicYearId:', academicYearId);
    const select = document.getElementById('subject-select');
    
    if (!select) {
        console.error('Subject select element not found!');
        return;
    }
    
    clearSelectOptions(select, 'Loading subjects...');
    
    if (!academicYearId) {
        console.log('No academicYearId provided, clearing subject select');
        clearSelectOptions(select, 'Select Subject');
        return;
    }

    try {
        console.log('Making API call to fetch subjects for academic year:', academicYearId);
        const startTime = Date.now();
        
        const response = await apiCall(`/api/faculty/academic-years/${academicYearId}/subjects`);
        console.log(`API call completed in ${Date.now() - startTime}ms`);
        
        if (!response) {
            throw new Error('No response from server');
        }
        
        console.log('Response status:', response.status, response.statusText);
        
        if (response.ok) {
            const subjects = await response.json();
            console.log('Subjects API response:', subjects);
            
            clearSelectOptions(select, 'Select Subject');
            
            if (!Array.isArray(subjects)) {
                console.error('Expected subjects to be an array, got:', subjects);
                throw new Error('Invalid response format: expected array of subjects');
            }
            
            if (subjects.length === 0) {
                console.log('No subjects found for academic year:', academicYearId);
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No subjects found';
                select.appendChild(option);
                return;
            }

            console.log(`Found ${subjects.length} subjects`);
            
            subjects.forEach((subject, index) => {
                const option = document.createElement('option');
                option.value = subject.id;
                // Use either name or subject_name, whichever is available
                const subjectName = subject.name || subject.subject_name || 'Unnamed Subject';
                option.textContent = subjectName;
                console.log(`Adding subject ${index + 1}:`, { id: subject.id, name: subjectName });
                select.appendChild(option);
            });
            
            console.log('Successfully populated subjects dropdown');
        } else {
            const errorText = await response.text();
            console.error('Error response from server:', errorText);
            throw new Error(`Server responded with status ${response.status}: ${errorText}`);
        }
    } catch (error) {
        console.error('Error in loadSubjectSelect:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            response: error.response
        });
        clearSelectOptions(select, 'Error loading subjects');
        
        // Show error to user
        const errorOption = document.createElement('option');
        errorOption.value = '';
        errorOption.textContent = 'Error loading subjects';
        select.appendChild(errorOption);
    }
}

// Academic Year Form
document.getElementById('academic-year-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        studentId: parseInt(formData.get('studentId')),
        institutionId: parseInt(formData.get('institutionId')),
        academicYear: formData.get('academicYear'),
        standardClass: formData.get('standardClass'),
        status: formData.get('status') || 'Complete'
    };
    
    try {
        const response = await apiCall('/api/faculty/academic-years', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        if (response) {
            const result = await response.json();
            alert(result.message || 'Academic year added successfully!');
            e.target.reset();
            invalidateAcademicYearCache(data.studentId);
            resetAttendanceYearSelect();
            if (attendanceStudentSelect && String(data.studentId) === attendanceStudentSelect.value) {
                handleAttendanceStudentChange({ target: attendanceStudentSelect });
            }
        }
    } catch (error) {
        console.error('Error adding academic year:', error);
        alert('Error adding academic year. Please try again.');
    }
});

// Add Subject Form
document.getElementById('add-subject-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        academicYearId: parseInt(formData.get('academicYearId')),
        subjectName: formData.get('subjectName'),
        maxMarks: parseInt(formData.get('maxMarks'))
    };
    
    try {
        const response = await apiCall('/api/faculty/subjects', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        if (response) {
            const result = await response.json();
            alert(result.message || 'Subject added successfully!');
            e.target.reset();
        }
    } catch (error) {
        console.error('Error adding subject:', error);
        alert('Error adding subject. Please try again.');
    }
});

// Add Marks Form
document.getElementById('add-marks-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        subjectId: parseInt(formData.get('subjectId')),
        marksObtained: parseInt(formData.get('marksObtained')),
        grade: formData.get('grade'),
        passFail: formData.get('passFail'),
        internalMarks: parseInt(formData.get('internalMarks')) || 0
    };
    
    try {
        const response = await apiCall('/api/faculty/marks', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        if (response) {
            const result = await response.json();
            alert(result.message || 'Marks added successfully!');
            e.target.reset();
        }
    } catch (error) {
        console.error('Error adding marks:', error);
        alert('Error adding marks. Please try again.');
    }
});

// Add Attendance Form
document.getElementById('add-attendance-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        academicYearId: parseInt(formData.get('academicYearId')),
        totalWorkingDays: parseInt(formData.get('totalWorkingDays')),
        daysAttended: parseInt(formData.get('daysAttended')),
        remarks: formData.get('remarks')
    };

    if (!data.academicYearId) {
        alert('Please select an academic year before adding attendance.');
        return;
    }

    if (!Number.isFinite(data.totalWorkingDays) || data.totalWorkingDays <= 0) {
        alert('Total working days must be greater than zero.');
        return;
    }

    if (!Number.isFinite(data.daysAttended) || data.daysAttended < 0) {
        alert('Days attended must be zero or greater.');
        return;
    }

    if (data.daysAttended > data.totalWorkingDays) {
        alert('Days attended cannot exceed total working days.');
        return;
    }
    
    try {
        const response = await apiCall('/api/faculty/attendance', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        if (response) {
            const result = await response.json();
            alert(result.message || 'Attendance recorded successfully!');
            e.target.reset();
            resetAttendanceYearSelect();
        }
    } catch (error) {
        console.error('Error adding attendance:', error);
        alert('Error adding attendance. Please try again.');
    }
});

// Load View Records Page
async function loadViewRecordsPage() {
    await loadStudentSelectForView();
}

async function loadStudentSelectForView() {
    try {
        const response = await apiCall('/api/faculty/students');
        if (!response) return;
        
        const students = await response.json();
        const select = document.getElementById('view-student-select');
        select.innerHTML = '<option value="">Select Student</option>';
        
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.student_id} - ${student.name}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

async function loadStudentRecords() {
    const studentId = document.getElementById('view-student-select').value;
    if (!studentId) {
        document.getElementById('student-records-container').innerHTML = 
            '<p style="text-align: center; color: #666; padding: 40px;">Select a student to view their academic records</p>';
        return;
    }
    
    try {
        const response = await apiCall(`/api/faculty/academic-years/${studentId}`);
        if (!response) return;
        
        const academicYears = await response.json();
        const container = document.getElementById('student-records-container');
        
        if (academicYears.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No academic records found for this student.</p>';
            return;
        }
        
        let html = '';
        
        for (const year of academicYears) {
            html += `
                <div class="card" style="margin-bottom: 20px;">
                    <div class="card-header">
                        <div>
                            <div class="card-title">${year.standard_class} - ${year.academic_year}</div>
                            <div style="font-size: 14px; color: #666; margin-top: 5px;">
                                ${year.institution_name} (${year.institution_type}) | Status: ${year.status}
                            </div>
                        </div>
                        <div>
                            <button class="btn btn-primary" onclick="editAcademicYear(${year.id})" style="padding: 5px 10px; margin-right: 5px;">Edit</button>
                            <button class="btn btn-danger" onclick="deleteAcademicYear(${year.id})" style="padding: 5px 10px; margin-right: 5px;">Delete</button>
                            <button class="btn btn-success" onclick="loadYearSubjects(${year.id}, ${studentId})" style="padding: 5px 10px;">View Subjects</button>
                        </div>
                    </div>
                    <div id="year-${year.id}-subjects"></div>
                </div>
            `;
        }
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading student records:', error);
    }
}

async function loadYearSubjects(yearId, studentId) {
    try {
        const response = await apiCall(`/api/faculty/subjects/${yearId}`);
        if (!response) return;
        
        const subjects = await response.json();
        const container = document.getElementById(`year-${yearId}-subjects`);
        
        if (subjects.length === 0) {
            container.innerHTML = '<p style="color: #666; padding: 15px;">No subjects found for this academic year.</p>';
            return;
        }
        
        let html = `
            <div style="margin-top: 20px;">
                <h4>Subjects & Marks</h4>
                <table class="table-container">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Max Marks</th>
                            <th>Internal</th>
                            <th>Obtained</th>
                            <th>Grade</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        subjects.forEach(subject => {
            html += `
                <tr>
                    <td>${subject.subject_name}</td>
                    <td>${subject.max_marks}</td>
                    <td>${subject.internal_marks || 0}</td>
                    <td>${subject.marks_obtained || 'N/A'}</td>
                    <td>${subject.grade || 'N/A'}</td>
                    <td>${subject.pass_fail || 'N/A'}</td>
                    <td>
                        ${subject.mark_id ? 
                            `<button class="btn btn-primary" onclick="editMarks(${subject.mark_id}, ${subject.id})" style="padding: 3px 8px; margin-right: 3px;">Edit Marks</button>
                             <button class="btn btn-danger" onclick="deleteMarks(${subject.mark_id})" style="padding: 3px 8px; margin-right: 3px;">Delete Marks</button>` :
                            `<button class="btn btn-success" onclick="addMarksForSubject(${subject.id})" style="padding: 3px 8px;">Add Marks</button>`
                        }
                        <button class="btn btn-primary" onclick="editSubject(${subject.id})" style="padding: 3px 8px; margin-right: 3px;">Edit</button>
                        <button class="btn btn-danger" onclick="deleteSubject(${subject.id}, ${yearId})" style="padding: 3px 8px;">Delete</button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading subjects:', error);
    }
}

// Update Academic Year
async function editAcademicYear(yearId) {
    // In a real app, show a modal or form
    const newYear = prompt('Enter new academic year (e.g., 2023-2024):');
    const newClass = prompt('Enter new standard/class:');
    const newStatus = prompt('Enter status (Complete/Ongoing):');
    
    if (!newYear || !newClass) return;
    
    try {
        const response = await apiCall(`/api/faculty/academic-years/${yearId}`, {
            method: 'PUT',
            body: JSON.stringify({
                academicYear: newYear,
                standardClass: newClass,
                status: newStatus || 'Complete'
            })
        });
        
        if (response) {
            const result = await response.json();
            alert(result.message || 'Academic year updated successfully!');
            invalidateAcademicYearCache();
            if (attendanceStudentSelect && attendanceStudentSelect.value) {
                handleAttendanceStudentChange({ target: attendanceStudentSelect });
            }
            loadStudentRecords();
        }
    } catch (error) {
        console.error('Error updating academic year:', error);
        alert('Error updating academic year. Please try again.');
    }
}

// Delete Academic Year
async function deleteAcademicYear(yearId) {
    if (!confirm('Are you sure you want to delete this academic year? This will delete all subjects and marks associated with it.')) {
        return;
    }
    
    try {
        const response = await apiCall(`/api/faculty/academic-years/${yearId}`, {
            method: 'DELETE'
        });
        
        if (response) {
            const result = await response.json();
            alert(result.message || 'Academic year deleted successfully!');
            invalidateAcademicYearCache();
            if (attendanceStudentSelect && attendanceStudentSelect.value) {
                handleAttendanceStudentChange({ target: attendanceStudentSelect });
            }
            loadStudentRecords();
        }
    } catch (error) {
        console.error('Error deleting academic year:', error);
        alert('Error deleting academic year. Please try again.');
    }
}

// Edit Subject
async function editSubject(subjectId) {
    const newName = prompt('Enter new subject name:');
    const newMaxMarks = prompt('Enter new maximum marks:');
    
    if (!newName || !newMaxMarks) return;
    
    try {
        const response = await apiCall(`/api/faculty/subjects/${subjectId}`, {
            method: 'PUT',
            body: JSON.stringify({
                subjectName: newName,
                maxMarks: parseInt(newMaxMarks)
            })
        });
        
        if (response) {
            const result = await response.json();
            alert(result.message || 'Subject updated successfully!');
            const studentId = document.getElementById('view-student-select').value;
            loadStudentRecords();
        }
    } catch (error) {
        console.error('Error updating subject:', error);
        alert('Error updating subject. Please try again.');
    }
}

// Delete Subject
async function deleteSubject(subjectId, yearId) {
    if (!confirm('Are you sure you want to delete this subject? This will also delete associated marks.')) {
        return;
    }
    
    try {
        const response = await apiCall(`/api/faculty/subjects/${subjectId}`, {
            method: 'DELETE'
        });
        
        if (response) {
            const result = await response.json();
            alert(result.message || 'Subject deleted successfully!');
            loadYearSubjects(yearId, document.getElementById('view-student-select').value);
        }
    } catch (error) {
        console.error('Error deleting subject:', error);
        alert('Error deleting subject. Please try again.');
    }
}

// Edit Marks
async function editMarks(markId, subjectId) {
    const newMarks = prompt('Enter new marks obtained:');
    const newGrade = prompt('Enter new grade:');
    const newInternal = prompt('Enter internal marks (or leave blank for 0):');
    const newStatus = prompt('Enter Pass/Fail status:');
    
    if (!newMarks) return;
    
    try {
        const response = await apiCall(`/api/faculty/marks/${markId}`, {
            method: 'PUT',
            body: JSON.stringify({
                marksObtained: parseInt(newMarks),
                grade: newGrade || '',
                passFail: newStatus || 'Pass',
                internalMarks: parseInt(newInternal) || 0
            })
        });
        
        if (response) {
            const result = await response.json();
            alert(result.message || 'Marks updated successfully!');
            // Reload the year subjects
            const yearId = document.querySelector(`[id^="year-"][id$="-subjects"]`).id.split('-')[1];
            loadYearSubjects(yearId, document.getElementById('view-student-select').value);
        }
    } catch (error) {
        console.error('Error updating marks:', error);
        alert('Error updating marks. Please try again.');
    }
}

// Delete Marks
async function deleteMarks(markId) {
    if (!confirm('Are you sure you want to delete these marks?')) {
        return;
    }
    
    try {
        const response = await apiCall(`/api/faculty/marks/${markId}`, {
            method: 'DELETE'
        });
        
        if (response) {
            const result = await response.json();
            alert(result.message || 'Marks deleted successfully!');
            loadStudentRecords();
        }
    } catch (error) {
        console.error('Error deleting marks:', error);
        alert('Error deleting marks. Please try again.');
    }
}

// Add Marks for Subject
function addMarksForSubject(subjectId) {
    // Navigate to academic records page and pre-fill subject
    showPage('academic-records');
    setTimeout(() => {
        document.getElementById('subject-select').value = subjectId;
    }, 100);
}

// Load Institutions
async function loadInstitutions() {
    try {
        const response = await apiCall('/api/faculty/institutions');
        if (!response) return;
        
        const institutions = await response.json();
        const container = document.getElementById('institutions-list');
        
        if (institutions.length === 0) {
            container.innerHTML = '<p>No institutions found.</p>';
            return;
        }
        
        let         html = `
            <table class="table-container">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        institutions.forEach(institution => {
            html += `
                <tr>
                    <td>${institution.id}</td>
                    <td>${institution.name}</td>
                    <td>${institution.type}</td>
                    <td>${institution.address || 'N/A'}</td>
                    <td>
                        <button class="btn btn-primary" onclick="editInstitution(${institution.id})" style="padding: 5px 10px; margin-right: 5px;">Edit</button>
                        <button class="btn btn-danger" onclick="deleteInstitution(${institution.id})" style="padding: 5px 10px;">Delete</button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading institutions:', error);
    }
}

// Edit Institution
async function editInstitution(institutionId) {
    try {
        const response = await apiCall('/api/faculty/institutions');
        if (!response) return;
        
        const institutions = await response.json();
        const institution = institutions.find(i => i.id === institutionId);
        
        if (institution) {
            const newName = prompt('Enter new institution name:', institution.name);
            const newType = prompt('Enter new type (School/PU/College/University):', institution.type);
            const newAddress = prompt('Enter new address:', institution.address || '');
            
            if (!newName || !newType) return;
            
            const updateResponse = await apiCall(`/api/faculty/institutions/${institutionId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: newName,
                    type: newType,
                    address: newAddress
                })
            });
            
            if (updateResponse) {
                const result = await updateResponse.json();
                alert(result.message || 'Institution updated successfully!');
                await loadInstitutions();
            }
        }
    } catch (error) {
        console.error('Error updating institution:', error);
        alert('Error updating institution. Please try again.');
    }
}

// Delete Institution
async function deleteInstitution(institutionId) {
    if (!confirm('Are you sure you want to delete this institution? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await apiCall(`/api/faculty/institutions/${institutionId}`, {
            method: 'DELETE'
        });
        
        if (response) {
            const result = await response.json();
            alert(result.message || 'Institution deleted successfully!');
            await loadInstitutions();
            await loadInstitutionSelect();
        }
    } catch (error) {
        console.error('Error deleting institution:', error);
        alert('Error deleting institution. Please try again.');
    }
}

// Add Institution Form
document.getElementById('add-institution-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        type: formData.get('type'),
        address: formData.get('address')
    };
    
    try {
        const response = await apiCall('/api/faculty/institutions', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        if (response) {
            const result = await response.json();
            alert(result.message || 'Institution added successfully!');
            e.target.reset();
            await loadInstitutions();
            await loadInstitutionSelect();
        }
    } catch (error) {
        console.error('Error adding institution:', error);
        alert('Error adding institution. Please try again.');
    }
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Load initial page
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    
    loadPageContent('dashboard');
});

