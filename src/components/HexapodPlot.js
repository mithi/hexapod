import React, { useEffect, useState, useRef } from "react"

const HexapodPlot = props => {
    const [ready, setReady] = useState(false)
    const ref = useRef()

    useEffect(() => {
        let cancel = false
        async function load() {
            const [Plotly, createPlotlyComponent] = await Promise.allSettled([
                import("plotly.js-gl3d-dist-min"),
                import("react-plotly.js/factory"),
            ]).then(values => values.map(({ value }) => value))

            ref.current = createPlotlyComponent.default(Plotly.default)

            if (!cancel) {
                setReady(true)
            }
        }
        load()

        return () => {
            cancel = true
        }
    }, [])

    if (!ready) {
        return null
    }

    const PlotEl = ref.current
    return (
        <PlotEl
            data={props.data}
            layout={props.layout}
            useResizeHandler={true}
            style={{ height: "100%", width: "100%" }}
            config={{ displaylogo: false, responsive: true }}
            onRelayout={props.onRelayout}
            revision={props.revision}
        />
    )
}

export default HexapodPlot
