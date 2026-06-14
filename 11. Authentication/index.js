// this module covers 

const express = require('express');
const path = require('path')
const app = express();
const port = 8000;

const {connectDB} = require('./connection');
const URL = require('./model/model.url');

const router = require('./routes/route.url');
const staticRoute = require('./routes/route.staticRouter')
const userRoute = require('./routes/route.user');

const cookieParser = require('cookie-parser');

const {restrictToLoggedInUserOnly, chechAuth} = require('./middleware/auth');

app.use((req,res, next)=> {
    if(req.path === '/favicon.ico ') res.send();
    console.log(`A Request of Type : ${req.method} was made by path : ${req.path} \n` );
    next();
})

app.use(cookieParser());


app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.json());

connectDB('mongodb://127.0.0.1:27017/Project-Url')

app.use(express.urlencoded({extended:false})) 

// inline middleware : where if u want to access anything inside /url it will pass through the inlinemiddleware to check if user is logged in or not 
app.use('/url', restrictToLoggedInUserOnly, router);
app.use('/user', userRoute);
app.use('/',chechAuth, staticRoute);

// to see the SSR
app.get('/test', async (req, res)=> {
    const allURL = await URL.find({});
    res.render('home', {
        urls: allURL,
    }) // along with .ejs we can also send additional information
})
app.get('/:id', async (req, res) => {
    const id = req.params.id;
    const entry = await URL.findOneAndUpdate(
        { shortID: id },
        {
            $push: {
                visitHistory: {
                    timestamps: Date.now()
                }
            }
        }
    );
    if (!entry) {
        return res.status(404).send("Short URL not found");
    }
    res.redirect(entry.redirectURL);
});
app.get('/url/analytics/:id', async (req, res) => {
    const targetURL = await URL.findOne({shortID: req.params.id});

    return res.json({
        totalClicks: targetURL.visitHistory.length,
        analytics: targetURL.visitHistory
    });
});

app.listen(port, ()=>{
    console.log(`Server Started on http://localhost:${port}`);
})