import React from "react"
import ReactMarkdown from "react-markdown"
import { ICON_COMPONENTS } from "../vars"

const AlertBox = ({ info }) => (
    <div className="message">
        <h2 className="red">
            {ICON_COMPONENTS.times} {info.subject}
        </h2>
        <ReactMarkdown source={info.body} />
    </div>
)

const ToggleSwitch = ({ value, handleChange, showLabel, labelTop }) => (
    <div className="switch-container">
        {
            // prettier-ignore
            showLabel && labelTop ? (<label className="label">{value}<br /></label>) : null
        }
        <label className="switch">
            <input type="checkbox" value={value} onChange={handleChange} />
            <span className="toggle-switch-widget round"></span>
            <br />
            {showLabel && !labelTop ? <label className="label">{value}</label> : null}
        </label>
    </div>
)

const Card = props => {
    const { className, title, children } = props

    return (
        <div className={className}>
            <props.h>{title}</props.h>
            {children}
        </div>
    )
}

const BasicButton = ({ handleClick, children }) => (
    <button type="button" className="button" onClick={handleClick}>
        {children}
    </button>
)

export { AlertBox, Card, ToggleSwitch, BasicButton }
