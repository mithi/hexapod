import { useCallback, useReducer, useRef } from "react"
import { getNewPlotParams } from "../../hexapod"
import * as defaults from "../../templates"

const mergeWithCounter = (prev, next) => ({
    ...prev,
    ...next,
    counter: prev.counter + 1,
})

export const usePlot = () => {
    const [plot, setPlot] = useReducer(mergeWithCounter, {
        data: defaults.DATA,
        layout: defaults.LAYOUT,
        counter: 0,
    })

    const cameraView = useRef()
    cameraView.current = defaults.CAMERA_VIEW

    /* * * * * * * * * * * * * *
     * Handle plot update
     * * * * * * * * * * * * * */

    const updatePlotWithHexapod = useCallback(hexapod => {
        if (hexapod === null || hexapod === undefined || !hexapod.foundSolution) {
            return
        }

        const [data, layout] = getNewPlotParams(hexapod, cameraView.current)

        return setPlot({
            data,
            layout,
        })
    }, [])

    const logCameraView = useCallback(relayoutData => {
        cameraView.current = relayoutData["scene.camera"] ?? defaults.CAMERA_VIEW
    }, [])

    return { plot, updatePlotWithHexapod, logCameraView }
}
