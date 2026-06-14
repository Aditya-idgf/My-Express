const http = require('http'); //internal module
const fs = require('fs')

const myServer = http.createServer((req, res)=> { // creates a http server , req => handels reqeust, res => handles response
    
    // console.log('New Req recived.');
    // console.log(req) // this is the request object containing info about the incoming request, check clg(req.headers)
    // res.end('HELLO FROM THE SERVER')
    
    // here we made a logger
    const log = `${Date.now()} : ${req.url} : NEW REQUEST ARRIVED \n`;
    fs.appendFile('./log.txt', log, (err) => {
        console.log('Some error occuored : ', err);
    })

    switch (req.url){
        case '/': res.end('HOME PAGE');
        break
        case '/about' : res.end('ABOUT PAGE');
        break
        default:
            res.end("404 FILE NOT FOUND!")
    }
    
});

myServer.listen(8000, ()=>{ // starts the server at port 8000
    console.log('Server Started at port 8000')
})