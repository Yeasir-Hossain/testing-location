const http = require('http');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const PORT = process.env.PORT || 4000;

function sendResponse(res, statusCode, contentType, data, ...args) {
    res.writeHead(statusCode, { 'Content-Type': contentType, ...args });
    res.end(data);
}

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'GET') {
        fetch('https://api.country.is/')
            .then(response => response.json())
            .then(response => sendResponse(res, 200, 'application/json', JSON.stringify(response)))
            .catch(e => sendResponse(res, 404, 'text/plain', 'Something went wrong'));
    }
    else {
        sendResponse(res, 500, 'text/plain', 'Internal Server Error');
    }
});

server.listen(PORT, async () => {
    console.log(`=> Server listening on port ${PORT}`);
});
