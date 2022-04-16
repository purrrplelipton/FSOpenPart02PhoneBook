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
    
    let nameArr = items.formInfo.name.replace(/[\W_]/g, "").split(""),
        letterCount = 0,
        numberCount = 0;
    nameArr.forEach(char => isNaN(char) ? letterCount+=1 : numberCount+=1);

    // console.log("letterCount", letterCount, "numberCount", numberCount)

    if (numberCount > letterCount) {
      setItems(prevState => ({
        ...prevState,
        errorMessage: `[error]: Name doesn't meet the criteria to be valid`
      }))
      return (
        setTimeout(() => {
          setItems(prevState => ({
            ...prevState,
            errorMessage: null
          }))
        }, 5000)
      );
    }

    // console.log(items.formInfo.number.replace(/[\W_]/g, "").match(/^\d/));
    
    if (
      items.formInfo.number.replace(/[\W_]/g, "").split("").length < 10 ||
      !items.formInfo.number.replace(/[\W_]/g, "").match(/^\d/)
    ) {
      setItems(prevState => ({
        ...prevState,
        errorMessage: `[error]: Number doesn't meet the criteria to be valid`
      }))
      return (
        setTimeout(() => {
          setItems(prevState => ({
            ...prevState,
            errorMessage: null
          }))
        }, 5000)
      );
    };

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
            setItems((prevState, props) => ({
              ...prevState,
              persons: prevState.persons.map(p => p.id !== id ? p : returnedPerson),
              errorMessage: `${prevState.formInfo.name}'s number has been changed`
            }))
            setTimeout(() => setItems(
              (prevState, props) => ({
                ...prevState, errorMessage: null
              })), 5000
            )
          })
          .catch(error => {
            setItems((prevState, props) => ({
              ...prevState,
              errorMessage: `[error]: ${prevState.formInfo.name} has already been removed from server`,
              persons: prevState.persons.filter(p => p.id !== id),
              formInfo: { ...prevState.formInfo, name: "", number: "" }
            }))
            setTimeout(() => {
              setItems((prevState, props) => ({
                ...prevState,
                errorMessage: null
              }));
            }, 5000);
          });
      } else {
        setItems(prevState => ({
          ...prevState,
          errorMessage: `[error]: User has declined replacing ${items.formInfo.name}'s number`
        }))
        setTimeout(() => {
          return (setItems(prevState => ({
            ...prevState,
            errorMessage: null
          })));
        }, 5000)
      }
    } else {
      const personObject = {
        name: items.formInfo.name,
        number: items.formInfo.number,
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
        .catch(error => {
          const status = error.response.status,
                statusText = error.response.statusText;
          setItems(prevState => ({
            ...prevState,
            errorMessage: `[error]: ${status} (${statusText})`
          }))
          // console.log(error.response.statusText);
          return (
            setTimeout(() => {
              setItems(prevState => ({
                ...prevState,
                errorMessage: null
              }))
            }, 5000)
          );
        })
    }
    // return (
    //   setItems(prevState => ({
    //     ...prevState,
    //     errorMessage: `[error]: something went wrong`
    //   }))
      
    // );
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
      setTimeout(() => setItems(
        (prevState, props) => ({
          ...prevState,
          errorMessage: null
        })), 5000
      )
    } else {
      setItems(prevState => ({
        ...prevState,
        errorMessage: `[error]:User has declined to delete ${person.name}'s number`
      }))
      return (
        setTimeout(() => {
          setItems(prevState => ({
            ...prevState,
            errorMessage: null
          }))
        }, 5000)
      );
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
