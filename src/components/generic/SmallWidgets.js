import React from "react"
import { Link } from "react-router-dom"

const ToggleSwitch = props => (
    <>
        {props.labelTop ? (
            <label className="label">
                {props.value}
                <br />
            </label>
        ) : null}
        <label className="switch">
            <input
                type="checkbox"
                value={props.value}
                onChange={props.handleChange}
            />
            <span className="toggle-switch-widget round"></span>
            {!props.labelTop ? <label className="label">{props.value}</label> : null}
        </label>
    </>
)

const Card = props => (
    <div className={`${props.klass || ""}`}>
        <props.h>{props.title}</props.h>
        {props.children}
    </div>
)

const BasicLink = props => (
    <a
        className={`link-icon ${props.klass || ""}`}
        href={props.path}
        target="_blank"
        rel="noopener noreferrer"
    >
        <span>{props.symbol}</span>
    </a>
)

const PageLink = props => (
    <Link className={`link-icon ${props.klass || ""}`} to={props.path}>
        {props.symbol}
    </Link>
)

export { BasicLink, PageLink, Card, ToggleSwitch }
