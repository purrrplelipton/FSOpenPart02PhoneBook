import React from "react";

import Person from "../Person/Person";

const Content = ( props ) => props.persons.map( ( person, index ) => {
    return <Person
        key={index}
        person={person}
        clicked={props.clicked} />
    } );

export default Content;