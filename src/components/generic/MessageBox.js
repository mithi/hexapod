import React from "react"
const MessageBox = props => {
    let message = props.message || "No message"
    let newText = message.split("\n").map((item, i) => (
        <p className="sub-message" key={i}>
            {item}
        </p>
    ))
    return <div className="column-container border text">{newText}</div>
}

export default MessageBox
