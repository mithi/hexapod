import React from "react"
import { Link } from "react-router-dom"

const ToggleSwitch = ({ value, handleChange, showLabel, labelTop }) => (
    <div className="switch-container">
        {showLabel && labelTop ? (
            <label className="label">
                {value}
                <br />
            </label>
        ) : null}
        <label className="switch">
            <input type="checkbox" value={value} onChange={handleChange} />
            <span className="toggle-switch-widget round"></span>
            {showLabel && !labelTop ? <label className="label">{value}</label> : null}
        </label>
    </div>
)

const Card = props => (
    <div className={`${props.klass || ""}`}>
        <props.h>{props.title}</props.h>
        {props.children}
    </div>
)

const BasicButton = ({ handleClick, children }) => (
    <button type="button" className="button" onClick={handleClick}>
        {children}
    </button>
)

const BasicLink = props => (
    <a
        href={props.path}
        className={`link-icon ${props.className || ""}`}
        style={props.style}
        target="_blank"
        rel="noopener noreferrer"
    >
        <span>{props.children}</span>
    </a>
)

const PageLink = props => (
    <Link
        to={props.path}
        className={`link-icon ${props.className || ""}`}
        style={props.style}
    >
        <span>{props.children}</span>
    </Link>
)

export { BasicLink, PageLink, Card, ToggleSwitch, BasicButton }
