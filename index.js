const http = require('http');
const geoip = require('geoip-lite');

const PORT = process.env.PORT || 4000;

function sendResponse(res, statusCode, contentType, data, ...args) {
    res.writeHead(statusCode, { 'Content-Type': contentType, ...args });
    res.end(data);
}

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'GET') {
        const clientIP = req.headers["cf-connecting-ip"] || req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
        const geo = await geoip.lookup(clientIP);
        sendResponse(res, 200, 'application/json', JSON.stringify(geo))
    }
    else {
        sendResponse(res, 500, 'text/plain', 'Internal Server Error');
    }
});

server.listen(PORT, async () => {
    console.log(`=> Server listening on port ${PORT}`);
});
