const http = require('http');
const server = http.createServer((function (req, res) {
    res.writeHead(
        200,
        {"Content-Type" : "text/plain"});
    res.write('Hello wanderer');
    setTimeout( () => {
        res.end();
    }, 100)
}));

server.listen(7000, () => {
    console.log(`Server running at http://127.0.0.1:7000`);
});
