const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'resource_csr');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

function runCommand(command) {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        process.exit(1);
    }
}

const privateKeyPath = path.join(outputDir, 'resource.key');
const csrPath = path.join(outputDir, 'resource.csr');

runCommand(`openssl genrsa -out ${privateKeyPath} 2048`);
runCommand(`openssl req -new -key ${privateKeyPath} -out ${csrPath} -subj "/CN=RS-LAB22-RSA"`);
