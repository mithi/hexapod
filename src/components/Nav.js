import React from "react"
import { Link, NavLink } from "react-router-dom"
import { PATH_LINKS } from "./vars"

const BulletPageLink = ({ link }) => (
    <li>
        <NavLink
            to={link.path}
            exact={link.path === "/"}
            className="nav-link"
            activeClassName="is-active"
        >
            <span className="nav-link-icon" aria-hidden="true">
                {link.icon}
            </span>
            <span>{link.description}</span>
        </NavLink>
    </li>
)

const Nav = () => (
    <header className="app-header">
        <Link to="/" className="brand-lockup" aria-label="Hexapod Robot Simulator home">
            <span className="brand-mark" aria-hidden="true">
                H
            </span>
            <span className="brand-copy">
                <strong>HEXAPOD</strong>
                <small>Robot simulator</small>
            </span>
        </Link>

        <nav className="primary-navigation" aria-label="Primary navigation">
            <ul id="top-bar">
                {PATH_LINKS.map(link => (
                    <BulletPageLink key={link.path} link={link} />
                ))}
            </ul>
        </nav>
    </header>
)

const NavDetailed = () => (
    <footer className="app-footer">
        <span>Hexapod Robot Simulator</span>
        <span>Prototype kinematics · millimetres · tail omitted</span>
    </footer>
)

export { Nav, NavDetailed }
