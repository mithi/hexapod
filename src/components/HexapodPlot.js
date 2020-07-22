import React from "react"
import Plotly from "plotly.js-gl3d-dist-min"
import createPlotlyComponent from "react-plotly.js/factory"
import * as defaults from "../templates"
import { getNewPlotParams } from "../hexapod"

const Plot = createPlotlyComponent(Plotly)

class HexapodPlot extends React.Component {
    cameraView = defaults.CAMERA_VIEW

    logCameraView = relayoutData => {
        this.cameraView = relayoutData["scene.camera"]
    }

    render() {
        const [data, layout] = getNewPlotParams(this.props.hexapod, this.cameraView)

        const props = {
            data,
            layout,
            onRelayout: this.logCameraView,
            revision: this.props.revision,
            config: { displaylogo: false, responsive: true },
            style: { height: "100%", width: "100%" },
            useResizeHandler: true,
        }

        return <Plot {...props} />
    }
}

export default HexapodPlot