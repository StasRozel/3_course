const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'certificates');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const caKeyPath = path.join(outputDir, 'ca.key');
const caCertPath = path.join(outputDir, 'ca.crt');

const csrDir = path.join(outputDir, 'resource_csr');
if (!fs.existsSync(csrDir)) {
    fs.mkdirSync(csrDir);
}

const csrPath = path.join(csrDir, 'resource.csr');
const certPath = path.join(csrDir, 'resource.crt');
const extFilePath = path.join(outputDir, 'san.ext');

const cfg = path.join(__dirname, 'lab22.cfg');

function runCommand(command) {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        process.exit(1);
    }
}

runCommand(
    `openssl x509 -req -in ${csrPath} -CA ${caCertPath} -CAkey ${caKeyPath} -CAcreateserial -out ${certPath} -days 365 -sha256 -extfile ${cfg} -extensions v3_req`
);
