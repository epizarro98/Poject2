require('dotenv').config()
const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
let cloudinary = require('cloudinary');
let multer = require('multer');
const db = require('./models/index.js');
let upload = multer({ dest: './uploads/' });
let imgUrl = cloudinary.url('i5gehdy7vlsmx20ug32x', {width: 250, height: 250})


//setup ejs and ejs layouts
app.set('view engine', 'ejs')
app.use(ejsLayouts) 
app.use(express.urlencoded({extended: false}))
cloudinary.config(process.env.CLOUDINARY_URL)



app.get('/', function(req, res) {
    res.render('home');
    res.render('home', { image: imgUrl });
  });


// cloudinary post route
app.post('/', upload.single('myFile'), function(req, res) {
  cloudinary.uploader.upload(req.file.path, function(result) {
    // res.send(result.url);
    db.mail.findOrCreate({
        where: {
            url: result.url
        },
    }).then(([mail, created])=>{
        db.user.findOne()
        .then(user=>{
            user.addMail(mail)
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

app.listen(3000, ()=>{
    console.log('youre now in port 3000')
})
