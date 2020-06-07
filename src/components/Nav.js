import React from "react"
import { BasicLink, PageLink } from "./generic/SmallWidgets"

const URL_KOFI = "https://ko-fi.com/minimithi"
const URL_SRC = "https://github.com/mithi/hexapod-robot-simulator"

const ICON_KOFI = "🍵"
const PATH_IK = "inverse-kinematics"
const PATH_FK = "forward-kinematics"
const PATH_LP = "leg-patterns"
const PATH_ROOT = "/"

const ICONS = ["🍵", "👾"]
const URLS = [URL_KOFI, URL_SRC]
const PATHS = [PATH_ROOT, PATH_FK, PATH_IK, PATH_LP]

const NavContent = () => (
    <>
        {URLS.map((path, index) => (
            <BasicLink
                className="link-icon"
                key={URL_KOFI}
                path={path}
                symbol={ICONS[index]}
            />
        ))}
        {PATHS.map(path => (
            <PageLink key={path} path={path} symbol="●" />
        ))}
    </>
)

const NavFooter = () => (
    <footer class="footer">
        <NavContent />
    </footer>
)

const Nav = () => (
    <div class="nav">
        <NavContent />
    </div>
)

export { Nav, NavFooter }
