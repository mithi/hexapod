import React from "react"
import ReactMarkdown from "react-markdown"
import { ICON_COMPONENTS, RESET_LABEL } from "../vars"

const AlertBox = ({ info }) => (
    <div className="message">
        <h2 className="red">
            {ICON_COMPONENTS.times} {info.subject}
        </h2>
        <ReactMarkdown source={info.body} />
    </div>
)

const ToggleSwitch = React.memo(({ id, value, handleChange, showValue }) => (
    <div className="switch-container">
        <label className="switch" htmlFor={id}>
            <input id={id} type="checkbox" value={value} onChange={handleChange} />
            <span className="toggle-switch-widget round"></span>
        </label>
        <label className="label" htmlFor={id}>
            {showValue ? value : null}
        </label>
    </div>
))

const Card = React.memo(({ title, other, children }) => (
    <div>
        <div className="row-container flex-wrap">
            {title}
            {other}
        </div>
        {children}
    </div>
))

const BasicButton = React.memo(({ handleClick, children }) => (
    <button type="button" className="button" onClick={handleClick}>
        {children}
    </button>
))

const ResetButton = React.memo(({ reset }) => (
    <BasicButton handleClick={reset}>{RESET_LABEL}</BasicButton>
))

export { AlertBox, Card, ToggleSwitch, BasicButton, ResetButton }
