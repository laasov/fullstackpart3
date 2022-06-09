const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('reqbody', (req, res) => JSON.stringify(req.body))

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqbody', {
    skip: function (req, res) { return req.method !== "POST" }
}))
app.use(morgan('tiny', {
    skip: function (req, res) { return req.method === "POST" }
  }))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/api/persons', (req, res) => {
    console.log('get persons ok')
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    const nPpl = persons.length
    const time = new Date().toUTCString()
    res.send(
        `<p>Phonebook has info for ${nPpl} people</p>
        <p>${time}</p>`
    )
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    console.log('deleted')
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'missing name'
        })
    }
    
    if (!body.number) {
        return res.status(400).json({
            error: 'missing number'
        })
    }

    if (persons.map(person => person.name).includes(body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const newId = Math.floor(Math.random() * 1e5)

    const newPerson = {
        name : body.name,
        number : body.number,
        id : newId
    }

    persons = persons.concat(newPerson)
    res.json(newPerson)

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})