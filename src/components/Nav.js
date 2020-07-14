import React from "react"
import { URL_LINKS, PATH_LINKS } from "./vars"
import { Link } from "react-router-dom"

const NAV_BULLETS_PREFIX = "navBullet"
const NAV_DETAILED_PREFIX = "navDetailed"

const BulletPageLink = React.memo(({ link, showDesc }) => (
    <li>
        <Link to={link.path} className="link-icon">
            <span> {link.icon} </span>
            <span hidden={!showDesc}>{link.description}</span>
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

const Nav = React.memo(() => (
    <ul className="row-container no-bullet" id="top-bar">
        {URL_LINKS.map(link => (
            <BulletUrlLink
                path={link.url}
                key={NAV_BULLETS_PREFIX + link.url}
                icon={link.icon}
            />
        ))}

        {PATH_LINKS.map(link => (
            <BulletPageLink key={NAV_BULLETS_PREFIX + link.path} link={link} />
        ))}
    </ul>
))

const NavDetailed = React.memo(() => (
    <footer>
        <nav id="nav">
            <ul className="grid-cols-1 no-bullet">
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
                        link={link}
                        showDesc={true}
                    />
                ))}
            </ul>
        </nav>
    </footer>
))

export { Nav, NavDetailed }
