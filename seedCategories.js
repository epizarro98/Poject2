const db = require('./models')

let names = ['uncategorized', 'bills', 'letters', 'junk mail', 'school', 'holiday cards', 'invitations', 'gift cards', 'packages'];

names.forEach(name=>{
    db.category.create({categoryName: name})
    .then((category)=>{
        console.log(`🤡 created category ${category.categoryName}`)
    }).catch(err=>{
        console.log('😠')
        console.log(err)
    })
})