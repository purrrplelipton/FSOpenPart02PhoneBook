import React from "react";

const Filter = ( props ) => {
    return (
        <div>
            <input placeholder="filter by..." value={props.value} onChange={props.changed} />
        </div>
    );
}

export default Filter;