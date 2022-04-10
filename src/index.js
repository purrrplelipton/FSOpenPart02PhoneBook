import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import "./index.css";

import axios from "axios";

axios.get(
  "http://localhost:3000/persons"
).then(res => {
  const persons = res.data;
  ReactDOM.createRoot(
    document.getElementById("root")
  ).render(
    <React.StrictMode>
      <App persons={persons} />
    </React.StrictMode>
  );
})

