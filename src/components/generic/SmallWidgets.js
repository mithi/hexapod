import React from "react"
import { Link } from "react-router-dom"

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

export { BasicLink, PageLink, Card }
