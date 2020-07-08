import React, { createContext, useContext, useMemo } from "react"

const HandlersCtx = createContext()

export function HandlersProvider({
    onPageLoad,
    updateIk,
    updatePose,
    updateDimensions,
    children,
}) {
    const value = useMemo(
        () => ({
            onPageLoad,
            updateIk,
            updatePose,
            updateDimensions,
        }),
        [onPageLoad, updateIk, updatePose, updateDimensions]
    )
    return <HandlersCtx.Provider value={value}>{children}</HandlersCtx.Provider>
}

export const usePageLoad = () => {
    const { onPageLoad } = useContext(HandlersCtx)
    return useMemo(() => onPageLoad, [onPageLoad])
}

export const RenderWithHandlers = ({ children, ...rest }) => {
    const {
        onPageLoad: onMount,
        updatePose: onUpdatePose,
        updateIk: onUpdateIk,
        updateDimensions: onUpdateDimensions,
    } = useContext(HandlersCtx)
    return children({ ...rest, onMount, onUpdatePose, onUpdateIk, onUpdateDimensions })
}

export const withHandlers = Component => props => {
    return (
        <RenderWithHandlers {...props}>
            {enhanced => <Component {...enhanced} />}
        </RenderWithHandlers>
    )
}
