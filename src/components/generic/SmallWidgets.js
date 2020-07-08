import React from "react"
import { ICON_COMPONENTS } from "../vars"

const AlertBox = ({ info }) => (
    <div className="message">
        <h2 className="red">
            {ICON_COMPONENTS.times} {info.subject}
        </h2>
        <p>{info.body}</p>
    </div>
)

const ToggleSwitch = ({ id, value, handleChange, showValue }) => (
    <div className="switch-container">
        <label className="switch" htmlFor={id}>
            <input id={id} type="checkbox" value={value} onChange={handleChange} />
            <span className="toggle-switch-widget round"></span>
        </label>
        <label className="label" htmlFor={id}>
            {showValue ? value : null}
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
