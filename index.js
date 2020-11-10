require('dotenv').config()
const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
let cloudinary = require('cloudinary');
let multer = require('multer');
const db = require('./models/index.js');
let upload = multer({ dest: './uploads/' });
let imgUrl = cloudinary.url('ivxhhdczxofx3rtze0cg', {width: 250, height: 250})


//setup ejs and ejs layouts
app.set('view engine', 'ejs')
app.use(ejsLayouts) 
app.use(express.urlencoded({extended: false}))
cloudinary.config(process.env.CLOUDINARY_URL)



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
app.get('/', (req, res)=>{
    // res.send('EXPRESS AUTH HOME ROUTE')
    res.render('category')
})

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

app.get('/:id', (req, res)=>{
    // res.send('hellooooooooo')
    console.log(req.params.id)
    db.category.findOne({
        where: {id: req.params.id},
        include: [db.mail]
    })
    .then((category)=>{
        console.log(category)
        //render category show page, pass in category to res.render in the show page
        if (!category) throw Error()
        res.render('category', {category: category, user: category.user})
        // res.send('hello')
    })
    .catch(err =>{
        console.log('THIS IS THE ERROR<================', err)
    })
})




//============================
app.listen(3000, ()=>{
    console.log('youre now in port 3000')
})