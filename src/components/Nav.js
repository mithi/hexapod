import React from "react"
import { FaGithubAlt } from "react-icons/fa"
import { GrStatusGoodSmall } from "react-icons/gr"
import { BasicLink, PageLink } from "./generic"
import { URLS, PATH_LINKS, LINK_DESCRIPTIONS } from "./texts"

const ICON_KOFI = "🍵"
const NAV_CONTENT_PREFIX = "navContent"
const NAV_DETAILED_PREFIX = "navDetailed"

const NavContent = () => (
    <ul className="row-container no-bullet top-bar">
        <li key={NAV_CONTENT_PREFIX + URLS.KOFI}>
            <BasicLink path={URLS.KOFI}>{ICON_KOFI}</BasicLink>
        </li>
        <li key={NAV_CONTENT_PREFIX + URLS.REPO}>
            <BasicLink path={URLS.REPO}>
                <FaGithubAlt className="vertical-align" />
            </BasicLink>
        </li>

        {PATH_LINKS.map((link, index) => (
            <li key={NAV_CONTENT_PREFIX + link.path}>
                <PageLink path={link.path}>
                    <GrStatusGoodSmall className="small-icon" />
                </PageLink>
            </li>
        ))}
    </ul>
)

const NavDetailed = () => (
    <ul className="column-container no-bullet" id="nav">
        <li key={NAV_DETAILED_PREFIX + LINK_DESCRIPTIONS.KOFI}>
            <BasicLink path={URLS.KOFI} className="text-link">
                {ICON_KOFI} {LINK_DESCRIPTIONS.KOFI}
            </BasicLink>
        </li>
        <li key={NAV_DETAILED_PREFIX + LINK_DESCRIPTIONS.REPO}>
            <BasicLink path={URLS.REPO} className="text-link">
                <FaGithubAlt className="vertical-align" /> {LINK_DESCRIPTIONS.REPO}
            </BasicLink>
        </li>

        {PATH_LINKS.map(link => (
            <li key={NAV_DETAILED_PREFIX + link.path}>
                <PageLink path={link.path} className="text-link">
                    <GrStatusGoodSmall className="small-icon" /> {link.description}
                </PageLink>
            </li>
        ))}
    </ul>
)

const Nav = () => <NavContent />

export { Nav, NavDetailed }
