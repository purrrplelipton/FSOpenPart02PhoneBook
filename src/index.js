import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import "./index.css";


const persons = [
  {
    "name": "Arto Hellas",
    "number": "123-456-789",
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
  },
  {
    "name": "Rhyan LeShawn",
    "number": "+1 408-616-8483",
    "id": 5
  }
]

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App persons={persons} />
  </React.StrictMode>
);
