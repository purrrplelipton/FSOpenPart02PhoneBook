import React, { useState, useEffect } from "react"

import Content from "./components/Content/Content";
import Filter from "./components/Filter/Filter";
import Notification from "./components/Notification/Notification"
import Form from "./components/Form/Form";
import personsService from "./services/Persons";

const App = () => {
  const [items, setItems] = useState( {
    persons: [],
    formInfo: { name: "", phone: "" },
    query: "",
    errorMessage: null
  } );

  useEffect(() => {
    personsService
    .getAll()
    .then(persons => {setItems({...items, persons: persons})})
  }, [items, items.persons, items.formInfo, items.query, items.errorMessage])

  const submitHandler = (event) => {
    event.preventDefault()
    if(items.persons.some(
      person => person.name.toLowerCase() === items.formInfo.name.toLowerCase()
      )) {
      const confirmChange = window.confirm(
        `${items.formInfo.name} is already added to phonebook, replace old number with new one ?`
      )
      if(confirmChange) {
        let personToChange = items.persons.find(person => person.name === items.formInfo.name)
        console.log(personToChange)
        let id = personToChange.id
        let newPerson = {...personToChange, number: items.formInfo.phone}
        console.log(newPerson)
        personsService
        .update(id, newPerson)
        .then(returnedPerson => {
          setItems({ ...items, persons: items.persons.map(person => person.id !== id ? items.persons : returnedPerson) })
          setItems({ ...items, errorMessage: `${items.formInfo.name}'s number has been changed` })
          setTimeout(() => {setItems(null)}, 5000)
        })
        .catch((error) => {
          setItems({ ...items, errorMessage: `${items.formInfo.name} has already been removed from server` })
          setItems({ ...items, persons: items.persons.filter(person => person.id !== id) })
        })
      } else {
        Promise.resolve(false)
        return (
          alert(`User has declined replacing ${items.formInfo.name}'s number`)
        )
      }
    } else {
      const personObject = {
      name: items.formInfo.name, 
      number: items.formInfo.phone, 
      id: items.persons.length + 1
      }
      personsService
      .create(personObject)
      .then(returnedPerson => {
        setItems({ ...items, persons: items.persons.concat(returnedPerson) })
        setItems({ ...items, errorMessage: `Added ${items.formInfo.name}` })
        setTimeout(() => {setItems(null)}, 5000)
      })
    }
  }

  const deletePersonHandler = ( id ) => {
    const person = items.persons.find(person => person.id === id)
    const confirmDelete = window.confirm(`Delete ${person.name} ?`)
    if(confirmDelete) {
      let deleted = true
      personsService
      .remove(id)
      .catch((error) => {
        console.log(error)
        deleted = false
      })
      .finally(() => {
        if(deleted) setItems({ ...items, persons: items.persons.filter(person => person.id !== id ) })
      })
      setItems(`removed ${person.name} from contact list`)
      setTimeout(() => setItems(null), 5000)
    } else {
      return (
        alert(`User has declined to delete ${person.name}'s contact details`)
      )
    }
    
  }

  const filterHandler = ( event ) => {
    setItems( { ...items, query: event.target.value } );
    const regex = new RegExp( items.query.toLowerCase(), "i" );
    const filteredPersons = () => items.persons.filter( person => person.name.toLowerCase().match(regex) )
    setItems( { ...items,persons: filteredPersons } );
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={items.errorMessage}/>
      <Filter value={items.query} changed={filterHandler} />
      <h1>add new contact</h1>
      <Form
        onSubmit={submitHandler}
        name={items.formInfo.name}
        number={items.formInfo.number}
        nameChangeHandler={
          (event) => setItems({
            ...items, formInfo: { ...items.formInfo, name: event.target.value }
          })
        }
        numberChangeHandler={
          (event) => setItems({
            ...items, formInfo: { ...items.formInfo, phone: event.target.value }
          })
        }
      />
      <h1>numbers</h1>
      <div>
        <Content persons={items.persons} clicked={deletePersonHandler} />
      </div>
    </div>
  )
}

export default App;
