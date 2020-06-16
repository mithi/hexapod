import React from "react"
import Plotly from "plotly.js-gl3d-dist-min"
import createPlotlyComponent from "react-plotly.js/factory"
const Plot = createPlotlyComponent(Plotly)

const HexapodPlot = props => {
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
