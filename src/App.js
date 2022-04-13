import React, { useState, useEffect } from "react"

import Filter from "./components/Filter/Filter";
import Notification from "./components/Notification/Notification"
import Form from "./components/Form/Form";
import personsService from "./services/Persons";

import "./App.css";

const App = () => {
  const [items, setItems] = useState({
    persons: [],
    formInfo: {name: "", number: ""},
    query: "",
    errorMessage: null
  });

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setItems((prevState, props) => {
          return ({
            ...prevState,
            persons: initialPersons
          });
        })
      });
  }, []);

  const submitHandler = (event) => {
    event.preventDefault();

    const regex = new RegExp(items.formInfo.name, "i");

    if(items.persons.some(p => p.name.match(regex))) {
      const confirmChange = window.confirm(
        `${items.formInfo.name} is already added to phonebook, replace old number with new one ?`
      );
      if(confirmChange) {
        const personToChange = items.persons.find(p => p.name.match(regex));
        const id = personToChange.id
        const newPerson = {...personToChange, number: items.formInfo.number}
        personsService
          .update(id, newPerson)
          .then(returnedPerson => {
            setItems((prevState, props) => {
              return ({
                ...prevState,
                persons: prevState.persons.map(p => p.id !== id ? p : returnedPerson),
                errorMessage: `${prevState.formInfo.name}'s number has been changed`
              });
            })
            setTimeout(() => 
              setItems((prevState, props) => {
                return {...prevState, errorMessage: null};
              }), 5000
            )
          })
          .catch(error => {
            setItems((prevState, props) => {
              return ({
                ...prevState,
                errorMessage: `${prevState.formInfo.name} has already been removed from server`,
                persons: prevState.persons.filter(p => p.id !== id)
              });
            })
          });
      } else {
        Promise.resolve(false)
        return alert(
          `User has declined replacing ${items.formInfo.name}'s number`
        );
      }
    } else {
      const personObject = {
        name: items.formInfo.name,
        number: items.formInfo.number || "invalid/empty number",
        id: items.persons.length + 1
      }

      personsService
        .create(personObject)
        .then(returnedPerson => {
          setItems((prevState, props) => {
            return ({
              ...prevState,
              persons: prevState.persons.concat(returnedPerson),
              errorMessage: `Added ${prevState.formInfo.name}`
            });
          })
          setTimeout(() => 
            setItems((prevState, props) => {
              return {...prevState, errorMessage: null};
            }), 5000
          )
        })
    }
  }

  const deletePersonHandler = ( id ) => {
    const person = items.persons.find(person => person.id === id)
    const confirmDelete = window.confirm(`Delete ${person.name} ?`)
    if(confirmDelete) {
      let deleted = true;
      personsService
        .remove(id)
        .catch(error => {
          deleted = false;
        })
        .finally(() => {
          if(deleted) {
            setItems((prevState, props) => {
              return ({
                ...prevState,
                persons: prevState.persons.filter(p => p.id !== id ),
                errorMessage: `removed ${person.name} from contact list`
              });
            });
          }
        })
      setTimeout(() => 
        setItems((prevState, props) => {
          return ({
            ...prevState,
            errorMessage: null
          });
        }), 5000
      )
    } else {
      return (
        alert(`User has declined to delete ${person.name}'s contact details`)
      )
    }
    
  }

  const changeFilterQuery = event => {
    return (
      setItems((prevState, props) => {
        return ({
          ...prevState,
          query: event.target.value
        });
      })
    );
  };
  
  const formNameChange = (event) => {
    setItems((prevState, props) => {
      return ({
        ...prevState,
        formInfo: {
          ...prevState.formInfo,
          name: event.target.value
        }
      });
    });
  };
  
  const formNumChange = (event) => {
    setItems((prevState, props) => {
      return ({
        ...prevState,
        formInfo: {
          ...prevState.formInfo,
          number: event.target.value
        }
      });
    });
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={items.errorMessage}/>
      <input
        placeholder="filter by..."
        onChange={changeFilterQuery}
      />
      <h1>add new contact</h1>
      <Form 
        clicked={submitHandler}
        name={items.formInfo.name}
        nameChange={formNameChange}
        number={items.formInfo.number}
        numChange={formNumChange}
      />
      <h1>numbers</h1>
      <Filter 
        persons={items.persons}
        query={items.query}
        clicked={deletePersonHandler}
      />
    </div>
  )
}

export default App;
