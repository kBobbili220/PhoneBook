import { useState, useEffect } from 'react'
import axios from 'axios'
import phoneService from './services/phones'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    phoneService.getAll()
    .then(initialPhones => {setPersons(initialPhones)})
  }, [])

  const updatePerson = (id, addedPerson) => {
    phoneService
      .update(id, addedPerson)
      .then(updatedPerson => {
        setPersons(persons.map(person => person.id === id ? updatedPerson : person))
        setMessage(`Updated ${addedPerson.name}`)
        setError(false)
      })
      .catch(error => {
        setMessage(`Information of ${addedPerson.name} has already been deleted from server.`)
        setError(true)
      })
    
  }

  const addPerson = (event) => {
    event.preventDefault()

    const addedPerson = {
      name: newName,
      number: newNumber,
    }

    const existingPerson = persons.find(
      person => person.name.trim().toLowerCase() === newName.trim().toLowerCase()
    )

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        updatePerson(existingPerson.id, addedPerson)
      } 
    } else {
      phoneService
        .create(addedPerson)
        .then(returnedPerson => { 
          setPersons(persons.concat(returnedPerson))
          setMessage(`Added ${addedPerson.name}`)
          setError(false)
        })
        .catch(error => {
          setMessage(`${error.response.data.error}`)
          setError(true)
        })
    }
    setNewName('')
    setNewNumber('')
    setTimeout(() => {setMessage(null)}, 3000)
  }

  const deletePerson = (id) => {
    const foundPerson = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${foundPerson.name}?`)){
      phoneService
      .remove(id)
      .then(deletedPerson => {
        setPersons(persons.filter(person => person.id !== id))
        setMessage(`${foundPerson.name} has been deleted.`)
      })
    }
  }

  const shown = persons.filter(p => p.name.toLowerCase().includes(filter.trim().toLowerCase()))

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} error={error}/>
      <div>
        filter shown with <input onChange={(event) => setFilter(event.target.value)}/>
      </div>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={(event) => setNewName(event.target.value)}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {shown.map(person => {
        return (
          <div key={person.id}>
            {person.name} {person.number}
            <button onClick={() => deletePerson(person.id)}>delete</button>
          </div>
        )
      }
      )}
    </div>
  )
}

export default App