import React from "react";

const Notification = ( props ) => {
    return props.message === null ?
    null :
    <div className="error">{props.message}</div>;
}

export default Notification;