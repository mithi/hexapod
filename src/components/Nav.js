import React from "react"

const URL_KOFI = "https://ko-fi.com/minimithi"
const URL_SRC = "https://github.com/mithi/hexapod-robot-simulator"
const ICON_KOFI = "🍵"
const ICON_DOT = "●"
const ICON_SRC = "👾"

const BasicLink = (props) => {
  return (
    <a
      className={`link-icon ${props.klass}`}
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
  <div style={{ display: "flex", flexDirection: "column" }}>
    <BasicLink
      url={URL_KOFI}
      symbol={`${ICON_KOFI} Buy me a coffee (or tea)`}
      klass="nav-footer"
    />
    <BasicLink
      url={URL_SRC}
      symbol={`${ICON_SRC} Source code`}
      klass="nav-footer"
    />
    <BasicLink url={URL_SRC} symbol={`> Root`} klass="nav-footer" />
    <BasicLink url={URL_SRC} symbol={`> Page 2`} klass="nav-footer" />
  </div>
)

export { NavBar, NavFooter }
