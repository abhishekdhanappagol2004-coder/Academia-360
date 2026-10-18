// Student Dashboard JavaScript

let currentPage = 'dashboard';
const studentAcademicYearMap = new Map();
let studentProfileCache = null;

function cacheAcademicYears(records = []) {
    records.forEach(record => {
        studentAcademicYearMap.set(record.id, record);
    });
}

async function getStudentProfileCached() {
    if (studentProfileCache) return studentProfileCache;
    const response = await apiCall('/api/student/profile');
    if (!response) return null;
    studentProfileCache = await response.json();
    return studentProfileCache;
}

function downloadFile(filename, content, mimeType = 'text/csv;charset=utf-8;') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function sanitizeFilename(value = '') {
    return value.replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_').toLowerCase();
}

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        showPage(page);
        
        // Update active nav link
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
        case 'profile':
            await loadProfile();
            break;
        case 'academic-records':
            await loadAcademicRecords();
            break;
        case 'downloads':
            await loadDownloads();
            break;
    }
}

// Load Dashboard
async function loadDashboard() {
    try {
        const response = await apiCall('/api/student/academic-timeline');
        if (!response) return;
        
        const timeline = await response.json();
        const timelineContainer = document.getElementById('academic-timeline');
        cacheAcademicYears(timeline);
        
        timelineContainer.innerHTML = '';
        
        timeline.forEach(record => {
            const card = createAcademicCard(record);
            timelineContainer.appendChild(card);
        });
        
        // Load attendance summary
        await loadAttendanceSummary();
        
        // Load performance chart
        await loadPerformanceChart();
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function createAcademicCard(record) {
    const card = document.createElement('div');
    card.className = `card academic-card ${record.standard_class.toLowerCase().includes('10th') || record.standard_class.toLowerCase().includes('sslc') ? 'sslc' : 
                     record.standard_class.toLowerCase().includes('12th') || record.standard_class.toLowerCase().includes('puc') ? 'puc' : 'degree'}`;
    
    const statusClass = record.status === 'Complete' ? 'status-passed' : 'status-ongoing';
    
    card.innerHTML = `
        <div class="card-header">
            <div>
                <div class="card-title">${record.standard_class} - ${record.academic_year}</div>
                <div style="font-size: 14px; color: #666; margin-top: 5px;">${record.institution_name}</div>
            </div>
            <div>
                <span class="status-badge ${statusClass}">${record.status}</span>
            </div>
        </div>
        <div class="percentage-display">
            ${record.avg_attendance ? `Attendance: ${parseFloat(record.avg_attendance).toFixed(1)}%` : 'N/A'}
        </div>
        <div style="margin-top: 10px; color: #666;">
            Subjects: ${record.subject_count || 0}
        </div>
        <div class="progress-bar" style="margin-top: 15px;">
            <div class="progress-fill" style="width: ${record.avg_attendance || 0}%"></div>
        </div>
        <button class="btn btn-primary" style="margin-top: 15px;" onclick="viewYearDetails(${record.id})">View Details</button>
    `;
    
    return card;
}

// Load Profile
async function loadProfile() {
    try {
        const response = await apiCall('/api/student/profile');
        if (!response) return;
        
        const profile = await response.json();
        const profileContent = document.getElementById('profile-content');
        
        profileContent.innerHTML = `
            <div class="form-grid">
                <div class="form-row">
                    <label>Name</label>
                    <input type="text" value="${profile.name || ''}" readonly>
                </div>
                <div class="form-row">
                    <label>Student ID</label>
                    <input type="text" value="${profile.student_id || ''}" readonly>
                </div>
                <div class="form-row">
                    <label>Date of Birth</label>
                    <input type="date" value="${profile.date_of_birth || ''}" readonly>
                </div>
                <div class="form-row">
                    <label>Age</label>
                    <input type="number" value="${profile.age || ''}" readonly>
                </div>
                <div class="form-row">
                    <label>Gender</label>
                    <input type="text" value="${profile.gender || ''}" readonly>
                </div>
                <div class="form-row">
                    <label>Email</label>
                    <input type="email" value="${profile.email || ''}" readonly>
                </div>
                <div class="form-row">
                    <label>Address</label>
                    <textarea readonly>${profile.address || ''}</textarea>
                </div>
                <div class="form-row">
                    <label>Parent/Guardian Name</label>
                    <input type="text" value="${profile.parent_guardian_name || ''}" readonly>
                </div>
                <div class="form-row">
                    <label>Contact Number</label>
                    <input type="text" value="${profile.contact_number || ''}" readonly>
                </div>
                <div class="form-row">
                    <label>Mentor Name</label>
                    <input type="text" value="${profile.mentor_name || ''}" readonly>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Load Academic Records
async function loadAcademicRecords() {
    try {
        const response = await apiCall('/api/student/academic-timeline');
        if (!response) return;
        
        const timeline = await response.json();
        const content = document.getElementById('academic-records-content');
        cacheAcademicYears(timeline);
        
        content.innerHTML = '';
        
        for (const record of timeline) {
            const yearCard = document.createElement('div');
            yearCard.className = 'card';
            
            yearCard.innerHTML = `
                <div class="card-header">
                    <div class="card-title">${record.standard_class} - ${record.academic_year}</div>
                    <span class="status-badge ${record.status === 'Complete' ? 'status-passed' : 'status-ongoing'}">${record.status}</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>Institution:</strong> ${record.institution_name} (${record.institution_type})
                </div>
                <div id="year-${record.id}-subjects">
                    <p>Loading subjects...</p>
                </div>
                <div id="year-${record.id}-attendance" style="margin-top: 20px;">
                    <p>Loading attendance...</p>
                </div>
            `;
            
            content.appendChild(yearCard);
            
            // Load subjects and marks for this year
            loadYearSubjects(record.id);
            loadYearAttendance(record.id);
        }
        
    } catch (error) {
        console.error('Error loading academic records:', error);
    }
}

async function loadYearSubjects(yearId) {
    try {
        const response = await apiCall(`/api/student/academic-year/${yearId}`);
        if (!response) return;
        
        const subjects = await response.json();
        const container = document.getElementById(`year-${yearId}-subjects`);
        
        if (subjects.length === 0) {
            container.innerHTML = '<p>No subjects found for this academic year.</p>';
            return;
        }
        
        let tableHTML = `
            <table class="table-container">
                <thead>
                    <tr>
                        <th>Subject Name</th>
                        <th>Internal Marks</th>
                        <th>Marks</th>
                        <th>Total</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        subjects.forEach(subject => {
            const total = (subject.internal_marks || 0) + (subject.marks_obtained || 0);
            tableHTML += `
                <tr>
                    <td>${subject.subject_name}</td>
                    <td>${subject.internal_marks || 0}/${subject.max_marks ? Math.floor(subject.max_marks * 0.3) : 30}</td>
                    <td>${subject.marks_obtained || 0}</td>
                    <td>${total}/${subject.max_marks}</td>
                    <td>${subject.grade || 'N/A'}</td>
                </tr>
            `;
        });
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        container.innerHTML = tableHTML;
        
    } catch (error) {
        console.error('Error loading year subjects:', error);
    }
}

async function loadYearAttendance(yearId) {
    try {
        const response = await apiCall(`/api/student/attendance/${yearId}`);
        if (!response) return;
        
        const attendance = await response.json();
        const container = document.getElementById(`year-${yearId}-attendance`);
        
        if (!attendance.total_working_days) {
            container.innerHTML = '<p>No attendance records found for this academic year.</p>';
            return;
        }
        
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                <div>
                    <strong>Total Working Days:</strong> ${attendance.total_working_days}
                </div>
                <div>
                    <strong>Days Attended:</strong> ${attendance.days_attended}
                </div>
                <div>
                    <strong>Attendance %:</strong> ${attendance.attendance_percentage}%
                </div>
            </div>
            ${attendance.remarks ? `<div style="margin-top: 15px;"><strong>Remarks:</strong> ${attendance.remarks}</div>` : ''}
        `;
        
    } catch (error) {
        console.error('Error loading attendance:', error);
    }
}

// Load Attendance Summary
async function loadAttendanceSummary() {
    try {
        const response = await apiCall('/api/student/academic-timeline');
        if (!response) return;
        
        const timeline = await response.json();
        let totalAttendance = 0;
        let count = 0;
        
        timeline.forEach(record => {
            if (record.avg_attendance) {
                totalAttendance += parseFloat(record.avg_attendance);
                count++;
            }
        });
        
        const overallAttendance = count > 0 ? (totalAttendance / count).toFixed(0) : 0;
        document.getElementById('overall-attendance').textContent = `${overallAttendance}%`;
    const circle = document.querySelector('.attendance-circle');
    if (circle) {
        circle.style.setProperty('--attendance-angle', `${overallAttendance * 3.6}deg`);
    }
        
    } catch (error) {
        console.error('Error loading attendance summary:', error);
    }
}

// Load Performance Chart
async function loadPerformanceChart() {
    try {
        const response = await apiCall('/api/student/academic-timeline');
        if (!response) return;
        
        const timeline = await response.json();
        const chartContainer = document.getElementById('performance-chart');
        
        chartContainer.innerHTML = '';
        
        timeline.slice(-6).forEach(record => {
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            const height = record.avg_attendance ? (record.avg_attendance / 100) * 200 : 20;
            bar.style.height = `${height}px`;
            
            const label = document.createElement('div');
            label.className = 'chart-label';
            label.textContent = record.standard_class.split(' ')[0] || 'N/A';
            
            const wrapper = document.createElement('div');
            wrapper.style.flex = '1';
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.appendChild(bar);
            wrapper.appendChild(label);
            
            chartContainer.appendChild(wrapper);
        });
        
    } catch (error) {
        console.error('Error loading performance chart:', error);
    }
}

// Load Downloads
async function loadDownloads() {
    try {
        const response = await apiCall('/api/student/academic-timeline');
        if (!response) return;
        
        const timeline = await response.json();
        cacheAcademicYears(timeline);
        const content = document.getElementById('downloads-content');
        
        if (timeline.length === 0) {
            content.innerHTML = '<p>No academic records available for download.</p>';
            return;
        }
        
        let html = `
            <h3>Available Downloads</h3>
            <p style="color: #666; margin-bottom: 15px;">Download your marks or attendance for any academic year.</p>
            <div style="display: flex; flex-direction: column; gap: 15px; margin-top: 20px;">
        `;
        
        timeline.forEach(record => {
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <div>
                        <strong>${record.standard_class} - ${record.academic_year}</strong><br>
                        <span style="color: #666; font-size: 14px;">${record.institution_name}</span>
                    </div>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="downloadMarksheet(${record.id})">Download Marks</button>
                        <button class="btn btn-secondary" style="background: #9C27B0; color: #fff;" onclick="downloadAttendanceSheet(${record.id})">Download Attendance</button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        content.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading downloads:', error);
    }
}
async function downloadMarksheet(yearId) {
    try {
        const [profile, response] = await Promise.all([
            getStudentProfileCached(),
            apiCall(`/api/student/academic-year/${yearId}`)
        ]);
        if (!response) return;
        const subjects = await response.json();

        if (!subjects.length) {
            alert('No subjects found for this academic year.');
            return;
        }

        const yearDetails = studentAcademicYearMap.get(yearId);
        const filenameSuffix = sanitizeFilename(`${yearDetails?.standard_class || 'class'}_${yearDetails?.academic_year || 'year'}`);

        let csv = '';
        if (profile) {
            csv += `Student Name,${profile.name || ''}\n`;
            csv += `Student ID,${profile.student_id || ''}\n`;
        }
        if (yearDetails) {
            csv += `Academic Year,${yearDetails.academic_year}\n`;
            csv += `Class,${yearDetails.standard_class}\n`;
            csv += `Institution,${yearDetails.institution_name}\n`;
        }
        csv += '\nSubject Name,Max Marks,Internal Marks,Marks Obtained,Total,Grade,Status\n';

        subjects.forEach(subject => {
            const total = (subject.internal_marks || 0) + (subject.marks_obtained || 0);
            csv += `${subject.subject_name || ''},${subject.max_marks || ''},${subject.internal_marks || 0},${subject.marks_obtained || 0},${total},${subject.grade || ''},${subject.pass_fail || ''}\n`;
        });

        downloadFile(`marks_${filenameSuffix}.csv`, csv);
    } catch (error) {
        console.error('Error downloading marksheet:', error);
        alert('Unable to download marksheet right now. Please try again later.');
    }
}

async function downloadAttendanceSheet(yearId) {
    try {
        const [profile, response] = await Promise.all([
            getStudentProfileCached(),
            apiCall(`/api/student/attendance/${yearId}`)
        ]);
        if (!response) return;
        const attendance = await response.json();

        if (!attendance || !attendance.total_working_days) {
            alert('No attendance record found for this academic year.');
            return;
        }

        const yearDetails = studentAcademicYearMap.get(yearId);
        const filenameSuffix = sanitizeFilename(`${yearDetails?.standard_class || 'class'}_${yearDetails?.academic_year || 'year'}_attendance`);

        let csv = '';
        if (profile) {
            csv += `Student Name,${profile.name || ''}\n`;
            csv += `Student ID,${profile.student_id || ''}\n`;
        }
        if (yearDetails) {
            csv += `Academic Year,${yearDetails.academic_year}\n`;
            csv += `Class,${yearDetails.standard_class}\n`;
            csv += `Institution,${yearDetails.institution_name}\n`;
        }
        csv += '\nTotal Working Days,Days Attended,Attendance Percentage,Remarks\n';
        csv += `${attendance.total_working_days},${attendance.days_attended},${attendance.attendance_percentage || 0},${attendance.remarks || ''}\n`;

        downloadFile(`attendance_${filenameSuffix}.csv`, csv);
    } catch (error) {
        console.error('Error downloading attendance:', error);
        alert('Unable to download attendance right now. Please try again later.');
    }
}

function viewYearDetails(yearId) {
    showPage('academic-records');
    setTimeout(() => {
        const element = document.getElementById(`year-${yearId}-subjects`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Load initial page content
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    
    loadPageContent('dashboard');
});

