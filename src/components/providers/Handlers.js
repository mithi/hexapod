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

export const useUpdatePose = () => {
    const { updatePose } = useContext(HandlersCtx)
    return useMemo(() => updatePose, [updatePose])
}

export const useUpdateIk = () => {
    const { updateIk } = useContext(HandlersCtx)
    return useMemo(() => updateIk, [updateIk])
}
