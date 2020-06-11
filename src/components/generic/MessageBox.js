import React from "react"
import ReactMarkdown from "react-markdown"
import { FaTimes, FaCheck } from "react-icons/fa"

const failureHeader = subject => (
    <h2 className="red">
        <FaTimes className="vertical-align" /> {subject}
    </h2>
)

const successHeader = subject => (
    <h2 className="blue">
        <FaCheck className="vertical-align" /> {subject}
    </h2>
)
const MessageBox = ({ info }) =>
    info ? (
        <div className="message">
            {info.isAlert ? failureHeader(info.subject) : successHeader(info.subject)}
            <ReactMarkdown source={info.body || ""} />
        </div>
    ) : null

export default MessageBox
