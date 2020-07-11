import React from "react"
import Plotly from "plotly.js-gl3d-dist-min"
import createPlotlyComponent from "react-plotly.js/factory"
const Plot = createPlotlyComponent(Plotly)

const HexapodPlot = ({ data, layout, onRelayout, revision }) => {
    const props = {
        data,
        layout,
        onRelayout,
        revision,
        config: { displaylogo: false, responsive: true },
        style: { height: "100%", width: "100%" },
        useResizeHandler: true,
    }
    return <Plot {...props} />
}

export default HexapodPlot
