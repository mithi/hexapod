import React from "react"
import { ICON_COMPONENTS, RESET_LABEL } from "../vars"

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
        <label className="switch">
            <input id={id} type="checkbox" value={value} onChange={handleChange} />
            <span className="toggle-switch-widget round"></span>
            <span style={{ opacity: 0 }}>{value}</span>
        </label>
        <label className="label">{showValue ? value : null}</label>
    </div>
)

const Card = ({ title, other, children }) => (
    <div>
        <div className="card-header">
            {title}
            {other}
        </div>
        {children}
    </div>
)

const BasicButton = ({ handleClick, children }) => (
    <button type="button" className="button" onClick={handleClick}>
        {children}
    </button>
)

const ResetButton = ({ reset }) => (
    <BasicButton handleClick={reset}>{RESET_LABEL}</BasicButton>
)

export { AlertBox, Card, ToggleSwitch, BasicButton, ResetButton }
