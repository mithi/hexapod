import React from "react"
import Plot from "react-plotly.js"

const HexapodPlot = props => {
    return (
        <Plot
            data={props.data}
            layout={props.layout}
            useResizeHandler={true}
            style={{ height: "100%", width: "100%"}}
            config={{ displaylogo: false, responsive: true }}
            onRelayout={props.onRelayout}
            revision={props.revision}
        />
    )
}

export default HexapodPlot
