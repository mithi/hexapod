import React from "react"
import { BasicLink, PageLink } from "./generic"
import { FaGithubAlt } from "react-icons/fa"
import { GrStatusGoodSmall } from "react-icons/gr"

const URL_KOFI = "https://ko-fi.com/minimithi"
const URL_SRC = "https://github.com/mithi/hexapod"
const ICON_KOFI = "🍵"

const URL_NAME_KOFI = "Buy me Ko-Fi"
const URL_NAME_SRC = "Source Code"

const PATHS = [
    { path: "inverse-kinematics", name: "Inverse kinematics" },
    { path: "forward-kinematics", name: "Forward kinematics" },
    { path: "leg-patterns", name: "Leg Patterns" },
    { path: "/", name: "Root" },
]

const NavContent = () => (
    <ul className="row-container no-bullet">
        <li key={URL_KOFI}>
            <BasicLink path={URL_KOFI}>{ICON_KOFI}</BasicLink>
        </li>
        <li key={URL_SRC}>
            <BasicLink path={URL_SRC}>
                <FaGithubAlt className="vertical-align" />
            </BasicLink>
        </li>

        {PATHS.map((path, index) => (
            <li key={index}>
                <PageLink path={path.path}>
                    <GrStatusGoodSmall className="small-icon" />
                </PageLink>
            </li>
        ))}
    </ul>
)

const NavDetailed = () => (
    <ul className="column-container no-bullet">
        <li key={URL_KOFI}>
            <BasicLink path={URL_KOFI} className="text-link">
                {ICON_KOFI} {URL_NAME_KOFI}
            </BasicLink>
        </li>
        <li key={URL_SRC}>
            <BasicLink path={URL_SRC} className="text-link">
                <FaGithubAlt className="vertical-align" /> {URL_NAME_SRC}
            </BasicLink>
        </li>

        {PATHS.map((path, index) => (
            <li key={index}>
                <PageLink path={path.path} className="text-link">
                    <GrStatusGoodSmall className="small-icon" /> {path.name}
                </PageLink>
            </li>
        ))}
    </ul>
)

const Nav = () => <NavContent />

export { Nav, NavDetailed }
