require('dotenv').config()
const path = require('path')
const express = require('express')
const Phone = require('./modules/phone')

const app = express()

app.use(express.json())
app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log("Method: ", request.method)
  console.log("Path: ", request.path)
  console.log("Body: ", request.body)
  console.log("---")
  next()
}

app.use(requestLogger)

app.get('/api/persons', (request, response) => {
  Phone.find({}).then(results => {
    response.json(results)
  })
})

app.get('/info', (request, response) => {
  Phone.countDocuments({}).then(count => {
    const requestTime = new Date()

    response.send(`
      <div>
      <p>Phonebook has info for ${count} people<p>
      <p>${requestTime}<p>
      <div>
      `)
    })
})

app.get('/api/persons/:id', (request, response) => {
  Phone.findById(request.params.id)
  .then((person) => {
    if (!person){
      response.status(404).end()
    } else {
      response.json(person)
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  Phone.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number){
    return response.status(400).json({error: "Error - name or number not provided"})
  }

  const phone = new Phone ({
    "name": body.name,
    "number": body.number
  })

  phone.save()
  .then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Phone.findById(request.params.id)
  .then(phone => {
    if (!phone) {
      return response.status(404).end()
    }

    phone.name = name
    phone.number = number

    return phone.save().then((newPhone) => {
      response.json(newPhone)
    })
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError'){
    response.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})