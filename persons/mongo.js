const mongoose = require("mongoose")
require("dotenv").config()

const url = process.env.DB_URL

mongoose.set("strictQuery", false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length < 3) {
  console.log("phonebook:")
  Person.find({}).then((persons) => {
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  const newName = process.argv[2]
  const newNumber = process.argv[3]

  const newPerson = new Person({
    name: newName,
    number: newNumber,
  })

  newPerson.save().then((result) => {
    console.log(`added ${newName} number ${newNumber} to phonebook`)
    mongoose.connection.close()
  })
}
