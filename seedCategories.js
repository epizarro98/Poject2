const db = require('./models')

let names = ['uncategorized', 'bills', 'letters'];

names.forEach(name=>{
    db.category.create({categoryName: name})
    .then((category)=>{
        console.log(`🤡 created category ${category.categoryName}`)
    }).catch(err=>{
        console.log('😠')
        console.log(err)
    })
})