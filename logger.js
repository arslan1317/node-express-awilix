const rfs = require('rotating-file-stream');
const path = require('path');
const pino = require('pino');
const fs = require('fs');
const { multistream } = require('pino-multi-stream');

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];

// Helper function to generate log file paths by date:
function getLogFilePath(prefix, time) {
    const d = time || new Date();

    const year = d.getFullYear();
    const monthName = monthNames[d.getMonth()]; // get month name string
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');

    const folderPath = path.join(logsDir, year.toString(), monthName, day);

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const filename = `${prefix}_dt_${hour}.log`;

    return path.join(year.toString(), monthName, day, filename);
}

// Create rotating streams for out.log and error.log
const outStream = rfs.createStream(time => getLogFilePath('out', time), {
    interval: '1h',
    path: logsDir,
    maxFiles: 300,
    initialRotation: true,
});

const errorStream = rfs.createStream(time => getLogFilePath('error', time), {
    interval: '1h',
    path: logsDir,
    maxFiles: 300,
    initialRotation: true
});

// Setup pino multistream for separating info and error logs
const streams = [
    { level: 'info', stream: outStream },
    { level: 'error', stream: errorStream }
];

const customLogger = pino({
    level: 10,
    serializers: {
        res(res) {
            return {
                code: res.statusCode,
                body: res.body
            };
        },
        req(req) {
            return {
                method: req.method,
                url: req.url,
                path: req.path,
                parameters: req.parameters,
                headers: req.headers
            };
        }
    }
}, multistream(streams));

module.exports = customLogger;