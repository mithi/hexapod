import React, { createContext, useContext, useMemo } from "react"

const HandlersCtx = createContext()

export function HandlersProvider({
    onPageLoad,
    updatePose,
    updateHexapod,
    updateDimensions,
    children,
}) {
    const value = useMemo(
        () => ({
            onPageLoad,
            updateHexapod,
            updatePose,
            updateDimensions,
        }),
        [onPageLoad, updateHexapod, updatePose, updateDimensions]
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
        updateDimensions: onUpdateDimensions,
        updateHexapod: onUpdateHexapod,
    } = useContext(HandlersCtx)
    return children({
        ...rest,
        onMount,
        onUpdatePose,
        onUpdateDimensions,
        onUpdateHexapod,
    })
}

export const withHandlers = Component => props => {
    return (
        <RenderWithHandlers {...props}>
            {enhanced => <Component {...enhanced} />}
        </RenderWithHandlers>
    )
}
