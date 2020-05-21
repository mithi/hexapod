import React from "react"
import { Link } from "react-router-dom"

const URL_KOFI = "https://ko-fi.com/minimithi"
const URL_SRC = "https://github.com/mithi/hexapod-robot-simulator"
const ICON_KOFI = "🍵"
const ICON_DOT = "●"
const ICON_SRC = "👾"
const PATH_IK = "inverse-kinematics"
const PATH_FK = "forward-kinematics"
const PATH_LP = "leg-patterns"

const PATH_ROOT = "/"
const ROOT_LINK_TXT = "💋 Root"
const IK_LINK_TXT = `${ICON_DOT} Inverse Kinematics`
const FK_LINK_TXT = `${ICON_DOT} Forward Kinematics`
const PATTERNS_LINK_TXT = `${ICON_DOT} Patterns`
const KOFI_LINK_TXT = `${ICON_KOFI} Buy Mithi coffee (or tea)`
const SRC_LINK_TXT = `${ICON_SRC} Source code`

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

const NavBar = () => (
    <div className="row-container">
        <BasicLink path={URL_KOFI} symbol={ICON_KOFI} />
        <BasicLink path={URL_SRC} symbol={ICON_SRC} />
        <PageLink path={PATH_ROOT} symbol={ICON_DOT} />
        <PageLink path={PATH_FK} symbol={ICON_DOT} />
        <PageLink path={PATH_IK} symbol={ICON_DOT} />
        <PageLink path={PATH_LP} symbol={ICON_DOT} />
    </div>
)

const NavFooter = () => (
    <div className="row-container nav-footer">
        <div className="column-container cell">
            <BasicLink
                path={URL_KOFI}
                symbol={KOFI_LINK_TXT}
                klass="nav-footer-link"
            />
            <BasicLink
                path={URL_SRC}
                symbol={SRC_LINK_TXT}
                klass="nav-footer-link"
            />
            <PageLink
                path={PATH_ROOT}
                symbol={ROOT_LINK_TXT}
                klass="nav-footer-link"
            />
        </div>
        <div className="column-container cell">
            <PageLink path={PATH_FK} symbol={FK_LINK_TXT} klass="nav-footer-link" />
            <PageLink path={PATH_IK} symbol={IK_LINK_TXT} klass="nav-footer-link" />
            <PageLink
                path={PATH_LP}
                symbol={PATTERNS_LINK_TXT}
                klass="nav-footer-link"
            />
        </div>
    </div>
)

export { NavBar, NavFooter }
