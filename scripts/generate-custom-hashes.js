// Generate bcrypt hashes for custom passwords
const bcrypt = require('bcryptjs');

const passwords = {
    admin: 'Admin@123',
    faculty: 'Faculty@123',
    student: 'Student@123'
};

async function generateHashes() {
    console.log('Generating password hashes for your custom passwords...\n');
    
    for (const [role, password] of Object.entries(passwords)) {
        const hash = await bcrypt.hash(password, 10);
        console.log(`${role}: ${password}`);
        console.log(`Hash: ${hash}\n`);
        console.log(`SQL: UPDATE users SET password = '${hash}' WHERE email = '${role}@sarms.com';\n`);
    }
}

generateHashes();

