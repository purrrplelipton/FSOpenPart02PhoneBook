import React from "react";

const Person = ( props ) =>
  <p>
    {props.person.name} {props.person.number} <button onClick={() => props.clicked(props.person.id)}>delete</button>
  </p>

export default Person;