import React from "react"
import createPlotlyComponent from "react-plotly.js/factory"

const PlotlyPromise = import(
    /* webpackChunkName: "Plotly-gl-3d", webpackPreload: true */ "plotly.js-gl3d-dist-min"
).then(Plotly => Plotly.default)

const HexapodPlot = props => {
    const ref = React.useRef()
    const [ready, setReady] = React.useState(false)

    React.useEffect(() => {
        let cancel
        PlotlyPromise.then(Plotly => {
            ref.current = createPlotlyComponent(Plotly)
        }).then(() => {
            if (!cancel) {
                setReady(true)
            }
        })

        return () => {
            cancel = true
        }
    }, [])

    if (!ready) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        )
    }

    const Plot = ref.current

    return (
        <Plot
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
