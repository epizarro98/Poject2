require('dotenv').config()
const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
let cloudinary = require('cloudinary');
let multer = require('multer');
const db = require('./models/index.js');
let upload = multer({ dest: './uploads/' });
let imgUrl = cloudinary.url('ivxhhdczxofx3rtze0cg', {width: 250, height: 250})
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')

//setup ejs and ejs layouts
app.set('view engine', 'ejs')
app.use(ejsLayouts) 
app.use(express.urlencoded({extended: false}))
cloudinary.config(process.env.CLOUDINARY_URL)


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// flash middleware
app.use(flash())

// CUSTOM MIDDLEWARE
app.use((req, res, next)=>{
    // before every route, attach the flash messsages and current user to res.locals
    // this will give us access to these values in all our ejs pages
    res.locals.alerts = req.flash()
    res.locals.currentUser = req.user
    next() // move on to the next piece of middleware
})

app.get('/', function(req, res) {
    res.render('home', { image: imgUrl });
  });


// cloudinary post route
app.post('/', upload.single('myFile'), function(req, res) {
  cloudinary.uploader.upload(req.file.path, function(result) {
    // res.send(result.url);
    imgUrl = result.url
    db.mail.findOrCreate({
        where: {
            url: result.url
        },
    }).then(([mail, created])=>{
        db.user.findOne()
        .then(user=>{
            user.addMail(mail)
            res.redirect('/')
            })
        .catch(err=>{
            console.log(err, 'ERROR <=====================')
            })
        })
    });
});

//controllers midware. This is what allows us to use the controllers routes
app.use('/auth', require('./controllers/auth.js'))
app.get('/', (req, res)=>{
    // res.send('EXPRESS AUTH HOME ROUTE')
    res.render('home')
})

// THIS ROUTE WILL BE FOR CATEGORIZED MAIL ONCE WE GET CLOUDINARY TO STOP PLAYIN
// app.get('/', (req, res)=>{
//     // res.send('EXPRESS AUTH HOME ROUTE')
//     res.render('category')
// })

//============================


// app.get('/', (req, res)=>{
//     db.category.findAll()
//     .then((categories)=>{
//         //render to category index, pass in category in the route
//         res.render('categories/index', {categories: categories})
//     })
//     .catch(err =>{
//         console.log(err)
//     })
// })

app.get('/category/:id', (req, res)=>{
    // res.send('hellooooooooo')
    // console.log(req.params.id)
    console.log(mailStorage)
    db.category.findOrCreate({ //make findOrCreate to give 
        where: {id: req.params.id} 
        // include: [db.mails]
    })
    .then((category)=>{
        //render category show page, pass in category to res.render in the show page
        // if (!category) {
        //     res.redirect('/')
        // }
        res.render('category', {category: category, mails: category.mails})
        // res.send('hello')
    })
    .catch(err =>{
        console.log('THIS IS THE ERROR<================', err)
    })
})

app.get('/profile', isLoggedIn, (req, res)=>{
    res.render('profile')
})


//============================
app.listen(process.env.PORT, ()=>{
    console.log('you\'re listening to the spooky sounds of port 3000')
})