import React, { useCallback, useLayoutEffect, useState, useRef } from "react"
import createPlotlyComponent from "react-plotly.js/factory"

import { sleep } from "../utils"

const PlotlyPromise = () =>
    import("plotly.js-gl3d-dist-min").then(Plotly => Plotly.default)

export const HexapodPlot = ({ data, layout, onRelayout, revision, promise }) => {
    const ref = useRef()
    const loadingRef = useRef()
    const promiseRef = useRef(promise)
    const [ready, setReady] = useState(false)
    const [error, setError] = useState(false)

    const loader = useCallback(() => {
        setError(false)

        promiseRef
            .current()
            .then(Plotly => {
                ref.current = createPlotlyComponent(Plotly)
            })
            .then(sleep(250))
            .then(() => {
                if (loadingRef.current) {
                    setReady(true)
                }
            })
            .catch(() => setError(true))
    }, [])

    useLayoutEffect(() => {
        loader()
    }, [loader])

    if (error) {
        return (
            <>
                <h2>Error Loading Plotly</h2>
                <button className="button" onClick={loader}>
                    Retry
                </button>
            </>
        )
    }

    if (!ready) {
        return <h2 ref={loadingRef}>Loading...</h2>
    }

    const Plot = ref.current

    return (
        <Plot
            data={data}
            layout={layout}
            useResizeHandler={true}
            style={{ height: "100%", width: "100%" }}
            config={{ displaylogo: false, responsive: true }}
            onRelayout={onRelayout}
            revision={revision}
            testId="plot"
        />
    )
}

const HexapodPlotWithPlotlyPromise = props => (
    <HexapodPlot {...props} promise={PlotlyPromise} />
)

export default HexapodPlotWithPlotlyPromise
