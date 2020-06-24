require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const baseUrl = '/api/persons'

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static("build"))

morgan.token('data', (req) => { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


app.get(baseUrl, (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})


app.get('/info', (req, res) => {
  Person.countDocuments({}).then(count => {
    res.send(`<h4>Phonebook has info for ${count} people</h4><br><p>${new Date()}</p>`)
  })
})


app.get(`${baseUrl}/:id`, (request, response, next) => {
  Person.findById(request.params.id)
    .then(note => {
      if (note) {response.json(note.toJSON()) }
      else {response.status(404).end()}
    })
    .catch(error => next(error))
})


app.delete(`${baseUrl}/:id`, (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndRemove(id)
  .then(() => {
    response.status(204).end()
  })
  .catch(error => next(error))
})


// const generateId = (maxId) => (Math.floor(Math.random() * (maxId + 1)))


app.post(baseUrl, (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})


app.put(`${baseUrl}/:id`, (request, response, next) => {
const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log('Server running')
})