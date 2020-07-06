import React from "react"
import { URL_LINKS, PATH_LINKS, ICON_COMPONENTS } from "./vars"
import { Link } from "react-router-dom"

const NAV_BULLETS_PREFIX = "navBullet"
const NAV_DETAILED_PREFIX = "navDetailed"

const BulletPageLink = React.memo(({ path, description }) => (
    <li>
        <Link to={path} className="link-icon">
            <span>
                {ICON_COMPONENTS.circle} {description}
            </span>
        </Link>
    </li>
))

const BulletUrlLink = React.memo(({ path, description, icon }) => (
    <li>
        <a
            href={path}
            className="link-icon"
            target="_blank"
            rel="noopener noreferrer"
            children={
                <span>
                    {icon} {description}
                </span>
            }
        />
    </li>
))

const NavBullets = React.memo(() => (
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
))

const NavDetailed = React.memo(() => (
    <footer>
        <nav id="nav">
            <ul className="column-container no-bullet">
                {URL_LINKS.map(link => (
                    <BulletUrlLink
                        path={link.url}
                        key={NAV_DETAILED_PREFIX + link.url}
                        icon={link.icon}
                        description={link.description}
                    />
                ))}

                {PATH_LINKS.map(link => (
                    <BulletPageLink
                        key={NAV_DETAILED_PREFIX + link.path}
                        path={link.path}
                        description={link.description}
                    />
                ))}
            </ul>
        </nav>
    </footer>
))

const Nav = React.memo(() => <NavBullets />)

export { Nav, NavDetailed }
