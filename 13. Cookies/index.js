// this module covers how cookies work. 

// Cookies : Cookies are small text files created by websites and stored on a user’s device by their web browser 
// to remember information about the user, such as login credentials, preferences, and browsing activity
// ex. 'to build a keep me logged in' feature we will store the user info in the cookies (encypted ofc.)
// there are 2 ways to send a the token generate by the server to the user in a secure way: 
// 1. using cookies. 2. using response. 

// when we send the cookie to the browser, it always stores that incoming cookie. So when ever u request something 
// from the server the browser along with ur reqest sends the cookie for that website

// since cookies are domain specific so browser will only send me the cookies that are related to that specific website, who's server initially creatad that cookie
// u can change the domain of who is creating the cookie: 

    // res.cookie('uid', token, {
    //     domain: 'https://www.google.com/'
    // }); // this way only google.com can access this generated cookie. 
    
    // similar to domain, we also have: expires, maxAge, secure, path, signed
    
    // if we do like : 
    // res.cookie('uid', token, {
    //     domain: 'https://.github.com/' 
    // }); // this way any sub domain of github.com can acceess this cookie, for Ex: api.github.com
    // this is how, if u login to gmail, u automatically get logged in to youtube as well 

// the downside of using cookies is that they are a browser feature and can be only used by browsers and mobile devices. 

// to solve this problem with mobile devices, we can send the token as json, that the mobile device can store in its storage. 
// later when requesting the server, the app can put the token in the header of the request. 
// it is done as :
        //authorization : Bearer <token>
// then the server reads the token to verify the user

// so inside our middleware/auth.js file, instead of doing (at both the restrictToLoggedInUserOnly and chechAuth functiosn): 
    // const userUid = req.cookies?.uid; 
// what we can do is : 
    // const userUid = req.header[authorization'];
    // const token = userUid.split('Bearer ')[1]; 
    // const user = getUser(token);

// so lets say my header was like : 
    // authorization : Bearer q3789r4q3uiodfj390qaFIK;
    // then my userUid becomes : "Bearer q3789r4q3uiodfj390qaFIK"
    // that will be split as : ['', 'q3789r4q3uiodfj390qaFIK']
    // here we take the 1st index and get our token

// test this by : 
// making a getting the token by login in to the user login of email and password. then in postman under the url section click the authentication tab. 
// there in the dropdown pick bearer token and paste the token. if everything is valid then u would be logged in using the token us passed as a header. 

const express = require('express');
const path = require('path')
const app = express();
const port = 8000;

const { connectDB } = require('./connection');
const URL = require('./model/model.url');

const router = require('./routes/route.url');
const staticRoute = require('./routes/route.staticRouter')
const userRoute = require('./routes/route.user');

const cookieParser = require('cookie-parser');

const { restrictToLoggedInUserOnly, chechAuth } = require('./middleware/auth');

app.use((req, res, next) => {
    if(req.path === '/favicon.ico') return res.send();
    console.log(`[${req.method}] Request path : ${req.path}`);
    next();
})

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

connectDB('mongodb://127.0.0.1:27017/Project-Url-[11]')

app.use('/url', restrictToLoggedInUserOnly, router);
app.use('/user', userRoute);
app.use('/', chechAuth, staticRoute);

app.get('/test', async (req, res) => {
    const allURL = await URL.find({});
    res.render('home', {
        urls: allURL,
    }) 
});

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
    const targetURL = await URL.findOne({ shortID: req.params.id });

    if (!targetURL) {
        return res.status(404).json({ error: "URL not found" });
    }

    return res.json({
        totalClicks: targetURL.visitHistory.length,
        analytics: targetURL.visitHistory
    });
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
})