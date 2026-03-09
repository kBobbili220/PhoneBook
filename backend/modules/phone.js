const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url)
mongoose.connect(url, {family: 4})
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Error in connecting to MongoDB: ', error.message)
    })

const phoneSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    }, 
    number: {
        type: String, 
        minLength: 8,
        match: [/^\d{2,3}-\d+$/, 'Phone number must be in format XX-XXXXXXX or XXX-XXXXXX']
    }
})

phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phone', phoneSchema)