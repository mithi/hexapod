import React, { createContext, useContext, useMemo } from "react"

const HandlersCtx = createContext()

export function HandlersProvider({
    onPageLoad,
    updatePose,
    updatePlotWithHexapod,
    updateDimensions,
    children,
}) {
    const value = useMemo(
        () => ({
            onPageLoad,
            updatePlotWithHexapod,
            updatePose,
            updateDimensions,
        }),
        [onPageLoad, updatePlotWithHexapod, updatePose, updateDimensions]
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
        updatePlotWithHexapod: onUpdatePlot,
    } = useContext(HandlersCtx)
    return children({
        ...rest,
        onMount,
        onUpdatePose,
        onUpdateDimensions,
        onUpdatePlot,
    })
}

export const withHandlers = Component => props => {
    return (
        <RenderWithHandlers {...props}>
            {enhanced => <Component {...enhanced} />}
        </RenderWithHandlers>
    )
}
