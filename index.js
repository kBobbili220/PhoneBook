import express from 'express'
import morgan from 'morgan'

const app = express()

app.use(express.json())
app.use(morgan('tiny'))

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    skip: (req) => req.method !== 'POST'
  })
)

let people = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(people)
})

app.get('/info', (request, response) => {
  const numEntries = people.length
  const requestTime = new Date()

  response.send(`
    <div>
    <p>Phonebook has info for ${numEntries} people<p>
    <p>${requestTime}<p>
    <div>
    `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = people.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  people = people.filter(p => p.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return String(Math.floor(Math.random() * 100000) + 1)
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  const lol = people.find(p => p.name.toLowerCase() === body.name.toLowerCase())

  if (!body.name || !body.number){
    return response.status(400).json({error: "Error - name or number not provided"})
  } else if (people.find(p => p.name.toLowerCase() === body.name.toLowerCase())) {
    return response.status(400).json({error: "name must be unique"})
  }

  const person = {
    "id": generateId(),
    "name": body.name,
    "number": body.number
  }

  people = people.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})