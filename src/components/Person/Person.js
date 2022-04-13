import React from "react";

const Person = ({person, clicked}) => (
    <div className="person">
        <p>{person.name} {person.number} </p>
        <button onClick={() => clicked(person.id)}>delete</button>
    </div>
);

export default Person;