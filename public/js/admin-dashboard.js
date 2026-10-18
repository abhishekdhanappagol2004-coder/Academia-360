// Admin Dashboard JavaScript

let currentPage = 'dashboard';

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
        case 'users':
            await loadUsers();
            break;
        case 'institutions':
            await loadInstitutions();
            break;
        case 'reports':
            await loadReports();
            break;
    }
}

// Load Dashboard
async function loadDashboard() {
    try {
        const [usersRes, studentsRes, institutionsRes, reportRes] = await Promise.all([
            apiCall('/api/admin/users'),
            apiCall('/api/faculty/students'),
            apiCall('/api/faculty/institutions'),
            apiCall('/api/admin/report')
        ]);
        
        if (usersRes) {
            const users = await usersRes.json();
            document.getElementById('total-users').textContent = users.length;
            
            const students = users.filter(u => u.role === 'student');
            document.getElementById('total-students').textContent = students.length;
        }
        
        if (institutionsRes) {
            const institutions = await institutionsRes.json();
            document.getElementById('total-institutions').textContent = institutions.length;
        }
        
        if (reportRes) {
            const report = await reportRes.json();
            if (report.avg_attendance) {
                document.getElementById('avg-attendance').textContent = parseFloat(report.avg_attendance).toFixed(1) + '%';
            }
        }
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Load Users
async function loadUsers() {
    try {
        const response = await apiCall('/api/admin/users');
        if (!response) return;
        
        const users = await response.json();
        const container = document.getElementById('users-list');
        
        if (users.length === 0) {
            container.innerHTML = '<p>No users found.</p>';
            return;
        }
        
        let html = `
            <table class="table-container">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        users.forEach(user => {
            html += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.email}</td>
                    <td><span class="status-badge ${user.role === 'admin' ? 'status-passed' : user.role === 'faculty' ? 'status-ongoing' : 'status-failed'}">${user.role}</span></td>
                    <td>${new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading users:', error);
    }
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
        
        let html = `
            <table class="table-container">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Address</th>
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
        }
    } catch (error) {
        console.error('Error adding institution:', error);
        alert('Error adding institution. Please try again.');
    }
});

// Load Reports
async function loadReports() {
    try {
        const response = await apiCall('/api/admin/report');
        if (!response) return;
        
        const report = await response.json();
        const container = document.getElementById('report-content');
        
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px;">
                <div style="padding: 20px; background: #f5f5f5; border-radius: 10px;">
                    <strong>Total Students:</strong> ${report.total_students || 0}
                </div>
                <div style="padding: 20px; background: #f5f5f5; border-radius: 10px;">
                    <strong>Total Institutions:</strong> ${report.total_institutions || 0}
                </div>
                <div style="padding: 20px; background: #f5f5f5; border-radius: 10px;">
                    <strong>Total Academic Years:</strong> ${report.total_academic_years || 0}
                </div>
                <div style="padding: 20px; background: #f5f5f5; border-radius: 10px;">
                    <strong>Average Attendance:</strong> ${report.avg_attendance ? parseFloat(report.avg_attendance).toFixed(2) + '%' : 'N/A'}
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

function generateReport() {
    // In a real application, this would generate a downloadable report
    alert('Report generation functionality would be implemented here.');
}

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

