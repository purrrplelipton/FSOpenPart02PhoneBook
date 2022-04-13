import React from "react";

import Person from "../Person/Person";

const Filter = ({query, persons, clicked}) => {
    const regex = new RegExp(query, "i");

    return persons.filter(person => 
        person.name.match(regex)
        ).map(person => (
            <div key={person.id}>
                <Person
                    person={person}
                    clicked={clicked}
                />
            </div>
        )
    )
};

export default Filter;