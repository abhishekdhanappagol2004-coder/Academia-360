// Helper script to generate password hashes
const bcrypt = require('bcryptjs');

const passwords = {
    admin: 'admin123',
    faculty: 'faculty123',
    student: 'student123'
};

async function generateHashes() {
    console.log('Generating password hashes...\n');
    
    for (const [role, password] of Object.entries(passwords)) {
        const hash = await bcrypt.hash(password, 10);
        console.log(`${role}: ${password}`);
        console.log(`Hash: ${hash}\n`);
        console.log(`SQL: UPDATE users SET password = '${hash}' WHERE email = '${role}@sarms.com';\n`);
    }
}

generateHashes();

