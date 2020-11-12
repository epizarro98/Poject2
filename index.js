require('dotenv').config()
const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
let cloudinary = require('cloudinary');
let multer = require('multer');
const db = require('./models/index.js');
let upload = multer({ dest: './uploads/' });
var uploadFile = require("express-fileupload");
let imgUrl = cloudinary.url('ivxhhdczxofx3rtze0cg', {width: 250, height: 250})
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')
const fs = require('fs');
//setup ejs and ejs layouts
app.set('view engine', 'ejs')
app.use(ejsLayouts) 
app.use(express.static("public"));
app.use(express.urlencoded({extended: false}))
app.use(uploadFile());
cloudinary.config(process.env.CLOUDINARY_URL)


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(__dirname + '/public'));
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

app.post ('/saveCat', async (req, res)=>{
    const id = req.body.categoryId;
    const {name, data} = req.files.myFile;
    const fn = "images/cat_"+id+"_"+name;
    const nmName = req.body.name;
    const date = req.body.date;
    const title = req.body.title;
    fs.writeFileSync("public/"+fn, data);
//find a way to store cloudinary image under category
    db.category_images.create({
        category_id: id,
        file_name: name,
        bytes: data
    }).then (
      //  cloudinary.uploader.upload(req.files.path, function(result) {});
        res.render('uploaded', {img: fn, categoryId: id, name: nmName, date: date, title: title})
     );
});

// cloudinary post route
app.post('/cloud', upload.single('myFile'), function(req, res) {
  cloudinary.uploader.upload(req.files.path, function(result) {
    // res.send(result.url);
    imgUrl = result.url
    db.mails.findOrCreate({
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

//controllers middleware. This is what allows us to use the controllers routes
app.use('/auth', require('./controllers/auth.js'))
app.get('/', (req, res)=>{
    // res.send('EXPRESS AUTH HOME ROUTE')
    res.render('home');
})

//new mail route
app.get('/new-mail',  (req, res)=>{
    db.category.findAll().then (function(rows){
        res.render('new-mail', {categories: rows});
    });
})

app.get('/category/:id', (req, res)=>{
    // res.send('hellooooooooo')
    // console.log(req.params.id)
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

app.put('/saveCat', function (req, res) {
    res.send('Got a PUT request at /user')
  })

app.listen(process.env.PORT, ()=>{
    console.log('you\'re listening to the spooky sounds of port 3000')
})