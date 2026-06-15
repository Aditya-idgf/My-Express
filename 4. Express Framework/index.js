const express = require('express'); // import modules
const app = express(); // this is our http serrver that is dynamically created and acts a handler function
const port = 8000; // listens to this port


// it handles the routing to paths and the http request made to them, making the code more structured and easy to understand
app.get('/', (req, res) => {
    res.end('HELLO FROM THE HOME PAGE')
})

app.get('/about', (req, res) => {
    
    // res.end('HELLO FROM THE ABOUT PAGE')
    res.end("Hello "+req.query.myName + ' !')
})

app.listen(port, ()=> {
    console.log(`Server Started on http://localhost:${port}`)
})