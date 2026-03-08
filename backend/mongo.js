const mongoose = require('mongoose')

if (process.argv.length < 3){
    console.log('give password as argument')
    process.exit()    
}

const password = process.argv[2]

const url = `mongodb+srv://karthikkbobbili_db_user:${password}@cluster0.onlgvxv.mongodb.net/phonebook?appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const phoneSchema = new mongoose.Schema({
    name: String, 
    number: String,
})

const Phone = mongoose.model('Phone', phoneSchema)

if (process.argv.length == 3){
    Phone.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(o => {
            console.log(`${o.name} ${o.number}`)
        })

        mongoose.connection.close()
    })
} else if (process.argv.length = 5){
    const newPhone = new Phone({
        name: process.argv[3],
        number: process.argv[4],
    }) 

    newPhone.save().then(result => {
        console.log(`Added ${newPhone.name} number ${newPhone.number} to phonebook`)
        mongoose.connection.close()
    })
}
