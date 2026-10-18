# Academia-360

A comprehensive full-stack web application for managing student academic records from 1st Standard through higher education. This system provides multi-institution tracking, year-wise academic records, marks management, and attendance tracking.


## Security and public-repository notes

- This project is intended for learning/demo use unless it has been security-reviewed before deployment.
- Copy `.env.example` to `.env` locally and fill in your own database credentials and a strong, random `JWT_SECRET` (at least 32 characters). `.env` is ignored by Git. Never commit secrets. You can generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and paste the output into your local `.env`.
- The example login accounts and sample data in the setup guides/SQL files are for local testing only. Change/remove them before any public deployment, and never reuse these passwords.
- Use a least-privilege MySQL account rather than the MySQL root account for deployments.
- Configure CORS, HTTPS, rate limiting, input validation, and production logging appropriately before exposing this application to the internet.

## Features

### Student Domain
- View personal details and profile
- Access complete academic timeline (all institutions attended)
- View year-wise subjects and marks
- Check attendance percentage for each academic year
- Download academic summary (marksheets)

### Faculty Domain
- Add/Update/Delete student personal details
- Add academic year records
- Add multiple subjects for any academic year
- Enter marks for each subject
- Enter attendance for each academic year
- Add/Manage institution details

### Admin Domain
- Manage users (student/faculty accounts)
- Manage institutions
- Verify academic records
- Generate consolidated academic reports

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Project Structure

```
PROJECT/
│
├── database/
│   └── schema.sql              # Database schema
│
├── public/
│   ├── css/
│   │   ├── style.css          # Main stylesheet
│   │   └── dashboard.css      # Dashboard-specific styles
│   │
│   ├── js/
│   │   ├── auth.js            # Authentication logic
│   │   ├── student-dashboard.js
│   │   ├── faculty-dashboard.js
│   │   └── admin-dashboard.js
│   │
│   ├── index.html             # Login page
│   ├── student-dashboard.html
│   ├── faculty-dashboard.html
│   └── admin-dashboard.html
│
├── server.js                  # Express server
├── package.json               # Node.js dependencies
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Step 1: Clone or Download the Project
```bash
cd PROJECT
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE sarms;
```

2. Import the schema:
```bash
mysql -u root -p sarms < database/schema.sql
```

Or manually execute the SQL file in your MySQL client.

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sarms
PORT=3000
JWT_SECRET=
```

### Step 5: Update Default Passwords

The schema includes sample users with placeholder password hashes. You need to update them:

1. Run Node.js to generate password hashes:
```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('admin123', 10).then(hash => console.log(hash));
bcrypt.hash('faculty123', 10).then(hash => console.log(hash));
bcrypt.hash('student123', 10).then(hash => console.log(hash));
```

2. Update the `users` table with the generated hashes:
```sql
UPDATE users SET password = 'generated_hash_here' WHERE email = 'admin@sarms.com';
UPDATE users SET password = 'generated_hash_here' WHERE email = 'faculty@sarms.com';
UPDATE users SET password = 'generated_hash_here' WHERE email = 'student@sarms.com';
```

Alternatively, use the registration endpoint to create new users.

### Step 6: Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Default Login Credentialscd

**Note**: These are sample accounts. You'll need to update the password hashes in the database as described in Step 5.

- **Admin**: 
  - Email: `admin@sarms.com`
  - Password: `admin123`
  
- **Faculty**: 
  - Email: `faculty@sarms.com`
  - Password: `faculty123`
  
- **Student**: 
  - Email: `student@sarms.com`
  - Password: `student123`

## Usage Guide

### For Students
1. Login with student credentials
2. Navigate to "Academic Records" to view complete academic history
3. Use "My Profile" to view personal details
4. Download marksheets from "Download Marksheets"

### For Faculty
1. Login with faculty credentials
2. Add new students from "Add Student" page
3. Manage existing students from "Manage Students"
4. Add academic records, subjects, marks, and attendance from "Academic Records"
5. Add/manage institutions from "Manage Institutions"

### For Admin
1. Login with admin credentials
2. View all users from "Manage Users"
3. Add/manage institutions
4. Generate system reports from "Reports"

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user

### Student Routes
- `GET /api/student/profile` - Get student profile
- `GET /api/student/institutions` - Get student institutions
- `GET /api/student/academic-timeline` - Get complete academic timeline
- `GET /api/student/academic-year/:yearId` - Get academic year details
- `GET /api/student/attendance/:yearId` - Get attendance for year

### Faculty Routes
- `GET /api/faculty/students` - Get all students
- `POST /api/faculty/students` - Add new student
- `PUT /api/faculty/students/:id` - Update student
- `DELETE /api/faculty/students/:id` - Delete student
- `POST /api/faculty/institutions` - Add institution
- `POST /api/faculty/academic-years` - Add academic year
- `POST /api/faculty/subjects` - Add subject
- `POST /api/faculty/marks` - Add marks
- `POST /api/faculty/attendance` - Add attendance

### Admin Routes
- `GET /api/admin/users` - Get all users
- `GET /api/admin/report` - Get consolidated report

## Database Schema

The system uses a normalized database structure with the following main tables:
- `users` - User authentication
- `students` - Student personal details
- `institutions` - Educational institutions
- `student_institutions` - Multi-institution tracking
- `academic_years` - Academic year records
- `subjects` - Subjects for each academic year
- `marks` - Marks for each subject
- `attendance` - Attendance records per academic year

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- All API endpoints (except login/register) require authentication
- Role-based access control implemented

## Future Enhancements

- PDF generation for marksheets
- Email notifications
- Advanced reporting and analytics
- Bulk data import/export
- Mobile responsive improvements
- Search and filter functionality
- Data visualization charts

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check `.env` file has correct database credentials
- Ensure database `sarms` exists

### Authentication Issues
- Verify password hashes are updated in database
- Check JWT_SECRET is set in `.env`
- Clear browser localStorage if token issues occur

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using port 3000

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please refer to the documentation or create an issue in the project repository.

