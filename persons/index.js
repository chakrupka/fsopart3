const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static("dist"))

morgan.token("body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body)
  }
  return ""
})

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method)
  console.log("Path:  ", request.path)
  console.log("Body:  ", request.body)
  console.log("---")
  next()
}

app.use(morgan(":method :url :status :res[content-length] - :response-time ms"))
// app.use(requestLogger)

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/info", (request, response) => {
  const info = `
    <p>Phonebook has info for ${persons.length} people<p>
    <p>${Date()}</p>
    `
  response.send(info)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  return Math.round(Math.random() * 100000)
}

app.post("/api/persons", (request, response) => {
  const body = request.body

  if (!body.name && !body.number) {
    return response.status(404).json({ error: "content missing" })
  } else if (!body.name || !body.number) {
    return response
      .status(404)
      .json({ error: "please include a name and a number" })
  } else if (persons.some((person) => person.name === body.name)) {
    return response
      .status(404)
      .json({ error: "name already exists in phonebook" })
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})

app.put("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  const updatedPerson = req.body
  persons.map((person) => (person.id !== id ? person : updatedPerson))

  res.json(updatedPerson)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
