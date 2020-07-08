import React, { createContext, useContext, useMemo } from "react"

const HexapodParamsCtx = createContext()

export function HexapodParamsProvider({ dimensions, pose, children }) {
    const value = useMemo(
        () => ({
            dimensions,
            pose,
        }),
        [dimensions, pose]
    )
    return <HexapodParamsCtx.Provider value={value}>{children}</HexapodParamsCtx.Provider>
}

export const RenderWithSelectedParam = ({ children, selector, ...rest }) => {
    const selected = selector(useContext(HexapodParamsCtx))
    return children({ ...rest, ...selected })
}

export const withHexapodParams = (Component, selector) => props => {
    return (
        <RenderWithSelectedParam {...props} selector={selector}>
            {enhanced => <Component {...enhanced} />}
        </RenderWithSelectedParam>
    )
}
