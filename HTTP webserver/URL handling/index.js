const http = require('http');
const fs = require('fs');
const url = require('url');

const myServer = http.createServer((req, res)=> { 

    if(req.url === "/favicon.ico") return res.end();

    // here we made a logger
    const log = `${Date.now()} : ${req.url} : NEW REQUEST ARRIVED \n`;

    const myURL = url.parse(req.url, true);
    console.log(myURL)

    fs.appendFile('./log.txt', log, (err) => {
        console.log('Some error occuored : ', err);
    })

    switch (myURL.pathname){
        case '/': res.end('HOME PAGE');
        break
        case '/about' : 
        const username = myURL.query.myName;
        res.end(`HELLO ${username} !`); 
        break
        default:
            res.end("404 FILE NOT FOUND!")
    }
    
});

myServer.listen(8000, ()=>{ // starts the server at port 8000
    console.log('Server Started at port 8000')
})