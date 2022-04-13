import React from "react";

const Form = ({clicked, name, nameChange, number, numChange}) => {

    return (
        <form onSubmit={clicked}>
            <input
                placeholder="name"
                value={name}
                onChange={nameChange}
            />
            <br /><br />
            <input
                placeholder="number"
                value={number}
                onChange={numChange}
            />
            <br /><br />
            <button type="submit">add</button>
        </form>
    );
}

export default Form;