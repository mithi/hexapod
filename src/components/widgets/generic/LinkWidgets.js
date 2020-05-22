import React from "react"
import { Link } from "react-router-dom"

const BasicLink = props => {
    return (
        <a
            className={`link-icon ${props.klass}`}
            href={props.path}
            target="_blank"
            rel="noopener noreferrer"
        >
            <span>{props.symbol}</span>
        </a>
    )
}

const PageLink = props => {
    return (
        <div className={`link-icon ${props.klass || ""}`}>
            <Link to={props.path}>{props.symbol}</Link>
        </div>
    )
}

export { BasicLink, PageLink }