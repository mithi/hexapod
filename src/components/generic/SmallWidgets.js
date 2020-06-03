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

const BasicLink = ({ path, symbol, klass }) => (
    <a
        className={`link-icon ${klass || ""}`}
        href={path}
        target="_blank"
        rel="noopener noreferrer"
    >
        <span>{symbol}</span>
    </a>
)

const PageLink = ({ path, symbol, klass }) => (
    <Link className={`link-icon ${klass || ""}`} to={path}>
        {symbol}
    </Link>
)

export { BasicLink, PageLink, Card, ToggleSwitch }
