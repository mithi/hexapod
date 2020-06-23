import React from "react"
import { URL_LINKS, PATH_LINKS, ICON_COMPONENTS } from "./vars"
import { Link } from "react-router-dom"

const NAV_BULLETS_PREFIX = "navBullet"
const NAV_DETAILED_PREFIX = "navDetailed"

const BulletPageLink = ({ path, description }) => (
    <li>
        <Link to={path} className="link-icon">
            <span>
                {ICON_COMPONENTS.circle} {description}{" "}
            </span>
        </Link>
    </li>
)

const BulletUrlLink = ({ path, description, icon }) => (
    <li>
        <a
            href={path}
            className="link-icon"
            target="_blank"
            rel="noopener noreferrer"
            children={
                <span>
                    {icon} {description}{" "}
                </span>
            }
        />
    </li>
)

const NavBullets = () => (
    <ul className="row-container no-bullet top-bar">
        {URL_LINKS.map(link => (
            <BulletUrlLink
                path={link.url}
                key={NAV_BULLETS_PREFIX + link.url}
                icon={link.icon}
            />
        ))}

        {PATH_LINKS.map(link => (
            <BulletPageLink key={NAV_BULLETS_PREFIX + link.path} path={link.path} />
        ))}
    </ul>
)

const NavDetailed = () => (
    <ul className="column-container no-bullet" id="nav">
        {URL_LINKS.map(link => (
            <BulletUrlLink
                path={link.url}
                key={NAV_DETAILED_PREFIX + link.url}
                icon={link.icon}
                description={link.description}
            />
        ))}

        {PATH_LINKS.map((link, index) => (
            <BulletPageLink
                key={NAV_DETAILED_PREFIX + link.path}
                path={link.path}
                description={link.description}
            />
        ))}
    </ul>
)

const Nav = () => <NavBullets />

export { Nav, NavDetailed }
