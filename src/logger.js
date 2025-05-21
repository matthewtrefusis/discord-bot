const fs = require('fs');
const path = require('path');

const logDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logFile = path.join(logDir, `${new Date().toISOString().slice(0,10)}.log`);

function log(message, error) {
    const timestamp = new Date().toISOString();
    let line = `[${timestamp}] ${message}`;
    if (error) {
        if (error instanceof Error) {
            line += `\n[Error] ${error.stack || error.message}`;
        } else {
            line += `\n[Error] ${JSON.stringify(error)}`;
        }
    }
    line += '\n';
    fs.appendFileSync(logFile, line);
    cleanupOldLogs();
}

// Delete log files older than 7 days
function cleanupOldLogs() {
    const files = fs.readdirSync(logDir);
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    files.forEach(file => {
        const filePath = path.join(logDir, file);
        if (file.endsWith('.log')) {
            try {
                const stats = fs.statSync(filePath);
                if ((now - stats.mtimeMs) > sevenDays) {
                    fs.unlinkSync(filePath);
                }
            } catch (err) {
                // Optionally log error or ignore
            }
        }
    });
}

module.exports = log;
