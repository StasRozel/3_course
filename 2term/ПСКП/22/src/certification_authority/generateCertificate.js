const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'certificates');
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

const caKeyPath = path.join(outputDir, 'ca.key');
const caCertPath = path.join(outputDir, 'ca.crt');

runCommand(`openssl genrsa -out ${caKeyPath} 2048`);
runCommand(`openssl req -x509 -new -nodes -key ${caKeyPath} -sha256 -days 365 -out ${caCertPath} -subj "/CN=CA-LAB22-RSA"`);
