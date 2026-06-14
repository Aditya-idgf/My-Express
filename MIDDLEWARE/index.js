// Middleware functions that execute during the request-response cycle to process requests, modify responses, or control application flow.  
// These functions have access to three key objects: the request object (req), the response object (res), and the next middleware function (next)

const express = require('express');
const app = express();
const port = 5000;

// this is a middleware function 

// this function is not good since its neither resolving the request nor letting it pass through
// getting our request stuck at this middleware
// app.use((req, res, next)=>{
//     console.log('HELLO TO MIDDLE WARE')
// })

// now this function will not let the req pass and just return "I WONT LET U PASS"
// app.use((req, res, next)=>{
//     console.log('HELLO TO MIDDLE WARE')
//     res.json({
//         "Status": "I WONT LET U PASS"
//     })
// })

// to let the req pass through we will call the next() function
// next() will either pass it to next middleware or to http methods 
app.use((req, res, next)=>{
    console.log('HELLO TO MIDDLE WARE 1')
    next();
})
app.use((req, res, next)=>{
    console.log('HELLO TO MIDDLE WARE 2')
    next();
})

app.get('/', (req, res)=>{
    res.send('HELLO FROM HOME PAGE');
})

app.listen(port, ()=>{
    console.log(`Server stated on http://localhost:${port}`);
})