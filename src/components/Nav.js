import React from "react"
import { URL_LINKS, PATH_LINKS, ICON_COMPONENTS } from "./texts"
import { Link } from "react-router-dom"

const NAV_BULLETS_PREFIX = "navContent"
const NAV_DETAILED_PREFIX = "navDetailed"

const BulletPageLink = ({ keyPrefix, path, description, className }) => (
    <li key={keyPrefix + path}>
        <Link to={path} className={`link-icon ${className || ""}`} >
            <span>{ICON_COMPONENTS.circle} {description} </span>
        </Link>
    </li>
)

const BulletUrlLink = ({ keyPrefix, path, text, icon }) => (
    <li key={keyPrefix + path}>
        <a
            href={path}
            className={"link-icon"}
            target="_blank"
            rel="noopener noreferrer"
            children={<span>{icon} {text} </span>}
        />
    </li>
)

const NavBullets = () => (
    <ul className="row-container no-bullet top-bar">
        {URL_LINKS.map(link => (
            <BulletUrlLink
                path={link.url}
                key={NAV_BULLETS_PREFIX}
                icon={link.icon}
            />
        ))}

        {PATH_LINKS.map(link => (
            <BulletPageLink
                keyPrefix={NAV_BULLETS_PREFIX}
                path={link.path}
            />
        ))}
    </ul>
)

const NavDetailed = () => (
    <ul className="column-container no-bullet" id="nav">
        {URL_LINKS.map(link => (
            <BulletUrlLink
                path={link.url}
                keyPrefix={NAV_DETAILED_PREFIX}
                icon={link.icon}
                text={link.description}
            />
        ))}

        {PATH_LINKS.map(link => (
            <BulletPageLink
                keyPrefix={NAV_DETAILED_PREFIX}
                path={link.path}
                description={link.description}
            />
        ))}
    </ul>
)

const Nav = () => <NavBullets />

export { Nav, NavDetailed }
