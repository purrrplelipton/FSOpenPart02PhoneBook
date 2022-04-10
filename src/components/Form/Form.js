import React from "react";

const Form = ( props ) => {
    return (
        <form onSubmit={props.submitHandler}>
            <input placeholder="name" value={props.name} onChange={props.nameChangeHandler} />
            <br /><br />
            <input placeholder="number" value={props.number} onChange={props.numberChangeHandler} />
            <br /><br />
            <button type="submit">add</button>
        </form>
    );
}

export default Form;