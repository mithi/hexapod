import React from "react"

const URL_KOFI = "https://ko-fi.com/minimithi"
const URL_SRC = "https://github.com/mithi/hexapod-robot-simulator"
const ICON_KOFI = "🍵"
const ICON_DOT = "●"
const ICON_SRC = "👾"

const BasicLink = (props) => {
  return (
    <a
      className={"link-icon nav-footer-link"}
      href={props.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {" "}
      <span>{props.symbol}</span>
    </a>
  )
}

const NavBar = () => (
  <div>
    <BasicLink url={URL_KOFI} symbol={ICON_KOFI} />
    <BasicLink url={URL_SRC} symbol={ICON_SRC} />
    <BasicLink url={URL_SRC} symbol={ICON_DOT} />
    <BasicLink url={URL_SRC} symbol={ICON_DOT} />
    <BasicLink url={URL_SRC} symbol={ICON_DOT} />
  </div>
)

const NavFooter = () => (
  <div className="row-container nav-footer">
    <div className="nav-column cell">
      <BasicLink
        url={URL_KOFI}
        symbol={`${ICON_KOFI} Buy Mithi coffee (or tea)`}
      />
      <BasicLink url={URL_SRC} symbol={`${ICON_SRC} Source code`} />
      <BasicLink url={URL_SRC} symbol={`💋 Root`} />
    </div>
    <div className="nav-column cell">
      <BasicLink url={URL_SRC} symbol={`${ICON_DOT} Forward Kinematics`} />
      <BasicLink url={URL_SRC} symbol={`${ICON_DOT} Inverse Kinematics`} />
      <BasicLink url={URL_SRC} symbol={`${ICON_DOT} Leg Patterns`} />
    </div>
  </div>
)

export { NavBar, NavFooter }
