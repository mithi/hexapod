import React from "react"
import { Link } from "react-router-dom"

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
        <div className={`${className || ""}`}>
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

const BasicLink = ({ path, className, style, children }) => (
    <a
        href={path}
        className={`link-icon ${className || ""}`}
        style={style}
        target="_blank"
        rel="noopener noreferrer"
    >
        <span>{children}</span>
    </a>
)

const PageLink = ({ path, className, style, children }) => (
    <Link to={path} className={`link-icon ${className || ""}`} style={style}>
        <span>{children}</span>
    </Link>
)

export { BasicLink, PageLink, Card, ToggleSwitch, BasicButton }
