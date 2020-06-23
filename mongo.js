const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('Give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://wintala:${password}@cluster0-ee5ur.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length===5) {
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(response => {
    console.log('person saved!')
    mongoose.connection.close()
  })
} 
else if(process.argv.length===3) {
  console.log('Phonebook');
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
else {console.log('Enter just password to inspect persons or "password name number" to add new person')
  mongoose.connection.close()}