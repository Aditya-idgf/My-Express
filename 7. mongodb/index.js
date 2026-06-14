// MongoDB is an open-source, NoSQL document-oriented database that stores data in flexible, JSON-like documents 
// (specifically in a binary format called BSON) rather than traditional rows and columns.  
// It is designed to handle large volumes of unstructured or semi-structured data with a dynamic schema, allowing developers to evolve data models 
// without downtime and map data structures directly to application code.


const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;
app.use(express.urlencoded({extended:false}))

app.use((req , res, next)=>{
    console.log('SOME REQUEST WAS MADE : ', req.method);
    next()
})

// in mongodb we first connect to our mongodb demon using .connect
// anything after 27017/ is the name of the database that will be made
mongoose.connect('mongodb://127.0.0.1:27017/MERA-DEMO-APP-1')
.then(()=>{console.log('connect to mongodb Successfully!')})
.catch((err)=>{
    console.log('Some Error Occured : ', err);
})

// after connecting to the mongondb we will need to make a schema that defines a structure of the data we ant to store
const userSchema = mongoose.Schema({
    "username": {
        type: String,
        required: true,
        unique: true,
    },
    "password": {
        type: String,
        required: true,    
    },
    "email": {
        type: String, 
        required: true,
        unique: true
    },
    'jobTitle': {
        type: String,
    },
    'gender': {
        type: String
    }
}, {
    timestamps: true
})

// after define the schema we make a model, model in mongodb compiles a Schema into a Model, 
// serving as the primary interface for interacting with MongoDB collections in Node.js applications
const User = mongoose.model('User', userSchema);


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

app.get('/users', async (req, res)=> {
    const allDBUsers = await User.find();
    const html = 
    `<ul>
        ${
            allDBUsers.map((user)=>`
                <li>
                    ${
                        user.username 
                    } : 
                    ${
                        user.email
                    }
                </li>
            `).join('')
        }
    </ul>`
    res.send(html);
}) 

app.get('/api/users', async(req, res) => {
    const allUSERS = await User.find();
    res.json(allUSERS);
})
app.post('/api/users', async (req, res)=> {
    const body = req.body;

    // here since the name of the fields are same on both sides we could have also done :
    // const result = await User.create({
    //     username,
    //     password,
    //     email,
    //     jobTitle: body.job,
    //     gender
    // })
    // Js will handle this for us
    const result = await User.create({
        username: body.username,
        password: body.password,
        email: body.email,
        jobTitle: body.job,
        gender: body.gender
    })

    console.log('RESULT : ', result)

    return res.status(201).json({
        msg: 'USER ADDED SUCCESSFULLY'
    })
})

app
.route('/api/users/:id')
.get(async(req, res) => {
    const userData = await User.findById(req.params.id);
    res.json(userData);
})
.patch(async (req, res)=>{
    const id = req.params.id;
    const pass = req.query.password;
    
    await User.findByIdAndUpdate(id, {
        password: pass
    })
    
    res.send({
        msg: `User : ${id} was updated successfully !`
    })
})
.delete(async(req, res) => {
    const userData = await User.findByIdAndDelete(req.params.id);
    res.json({
        msg: `User : ${id} was deleted successfully !`
    });
})


app.listen(port, ()=>{
    console.log(`Server Started on http://localhost:${port}`);
})