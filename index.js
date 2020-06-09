const baseUrl = '/api/persons'
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('data', (req, res) => { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))



let persons = [
      { 
        name: "Arto Hellas", 
        number: "040-123456",
        id: 1
      },
      { 
        name: "Ada Lovelace", 
        number: "39-44-5323523",
        id: 2
      },
      { 
        name: "Dan Abramov", 
        number: "12-43-234345",
        id: 3
      },
      { 
        name: "Mary Poppendieck", 
        number: "39-23-6423122",
        id: 5
      }
]

app.get(baseUrl, (req, res) => {
  res.json(persons)
})


app.get('/info', (req, res) => {
    res.send(`<h4>Phonebook has info for ${persons.length} people</h4><br><p>${new Date()}</p>`)
})


app.get(`${baseUrl}:id`, (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(x => x.id === id)
    if (person) {
      response.json(person)
    } 
    else {
      response.status(404).end()
    }
}) 


app.delete(`${baseUrl}:id`, (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(x => x.id !== id)
  
    response.status(204).end()
})


const generateId = (maxId) => (Math.floor(Math.random() * (maxId + 1)))

app.post(baseUrl, (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'missing name or number' 
    })
  }
  else if (persons.map(x => x.name).includes(body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(1000),
  }

  persons = persons.concat(person)

  response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('Server running')
})