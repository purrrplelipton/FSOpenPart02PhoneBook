import React from "react";

/* const successStyle = {
  backgroundColor: 'lightgrey',
  color: 'green',
  fontSize: 20,
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 10,
  marginBottom: 10
}
  
const errorStyle = {
  backgroundColor: 'lightgrey',
  color: 'red',
  fontSize: 20,
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 10,
  marginBottom: 10
} */
  
const Notification = ( props ) => {
    return props.message === null ?
    null :
    <div className="error">{props.message}</div>;
}

export default Notification;