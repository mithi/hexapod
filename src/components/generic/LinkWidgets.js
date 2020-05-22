import React from "react"
import { Link } from "react-router-dom"

const BasicLink = props => (
    <a
        className={`link-icon ${props.klass}`}
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

export { BasicLink, PageLink }
