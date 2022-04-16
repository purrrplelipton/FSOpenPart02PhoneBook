import React from "react";

const successStyle = {
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
}
  
const Notification = ({message}) => {
    return message === null ?
    null :
    message.includes("error") ?
    <div style={errorStyle} className="error">
      {message}
    </div> :
    <div style={successStyle} className="error">
      {message}
    </div>
}

export default Notification;