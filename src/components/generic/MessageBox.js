import React from "react"
const MessageBox = props => (
    <div className="column-container border text">{props.message || "No message"}</div>
)

export default MessageBox
