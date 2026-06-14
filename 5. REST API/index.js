// RESTAPI [Representative State Transfer Application Programming Interface], uses HTTP protocols to allow systems to communicate in a simple, uniform way.

const express = require('express'); 
const app = express(); 
const port = 8000; 

// since the data is encoded we need to use a middleware function to decode that and let express access the data in req.body
app.use(express.urlencoded({extended:false}))

const users = [
  {
    "id": 1,
    "name": "Aarav Sharma",
    "email": "aarav.sharma@example.com",
    "age": 24,
    "city": "Pune",
    "phone": "+91-9876543210"
  },
  {
    "id": 2,
    "name": "Priya Patel",
    "email": "priya.patel@example.com",
    "age": 27,
    "city": "Mumbai",
    "phone": "+91-9876543211"
  },
  {
    "id": 3,
    "name": "Rohan Verma",
    "email": "rohan.verma@example.com",
    "age": 22,
    "city": "Delhi",
    "phone": "+91-9876543212"
  },
  {
    "id": 4,
    "name": "Sneha Joshi",
    "email": "sneha.joshi@example.com",
    "age": 29,
    "city": "Bengaluru",
    "phone": "+91-9876543213"
  },
  {
    "id": 5,
    "name": "Karan Mehta",
    "email": "karan.mehta@example.com",
    "age": 31,
    "city": "Ahmedabad",
    "phone": "+91-9876543214"
  },
  {
    "id": 6,
    "name": "Ananya Gupta",
    "email": "ananya.gupta@example.com",
    "age": 25,
    "city": "Hyderabad",
    "phone": "+91-9876543215"
  },
  {
    "id": 7,
    "name": "Vikram Singh",
    "email": "vikram.singh@example.com",
    "age": 28,
    "city": "Jaipur",
    "phone": "+91-9876543216"
  },
  {
    "id": 8,
    "name": "Neha Kapoor",
    "email": "neha.kapoor@example.com",
    "age": 23,
    "city": "Chandigarh",
    "phone": "+91-9876543217"
  },
  {
    "id": 9,
    "name": "Rahul Nair",
    "email": "rahul.nair@example.com",
    "age": 30,
    "city": "Kochi",
    "phone": "+91-9876543218"
  },
  {
    "id": 10,
    "name": "Meera Iyer",
    "email": "meera.iyer@example.com",
    "age": 26,
    "city": "Chennai",
    "phone": "+91-9876543219"
  }
]

app.get('/', (req, res) => {
    res.end('HELLO FROM THE HOME PAGE')
})

// this is a API where when we call for data on this '/users', we get the users data
app.get('/api/users',(req, res) => {
    res.json(users);
})

// this is our server side rendering
app.get('/users', (req, res)=> {
    const html = `
        <ul>
            ${
                users.map((user)=> `
                    <li>
                        ${
                            user.name
                        }
                    </li>
                `).join('')
            }
        </ul>
    ` 
    res.send(html); 
})

// dynamic path parameters [/:id] => this id could be anything and is accessed using req.params.id
// app.get('/users/:id', (req, res) => {
//     console.log(req.params )
//     res.json(users[req.params.id]);
// })

// app.patch('/api/users/:id', (req, res)=>{
    
// })

// app.delete('/api/users/:id', (req, res)=>{
    
// })

// now since we are accessing the same route with different http requests 
// so instead of that what we can do is to setup a route to this path and attach http methods to it
app.route('/api/users/:id')
.get((req, res) => {
    console.log(req.params )
    res.json(users[req.params.id]);
})
// use POSTMAN to make post, patch and delete request
.patch((req, res)=>{
    
})
.delete((req, res)=>{
    
})

app.post('/api/users', (req, res)=>{
  const body = req.body;
    console.log(body);
})
app.listen(port, ()=> { 
    console.log(`Server Started on http://localhost:${port}`)
})