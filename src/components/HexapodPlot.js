import React from "react"
import * as defaults from "../templates"
import { getNewPlotParams } from "../hexapod"

import Scatter3d from "plotly.js/lib/scatter3d"
import Mesh3d from "plotly.js/lib/mesh3d"
import createPlotlyComponent from "react-plotly.js/factory"

class HexapodPlot extends React.Component {
    cameraView = defaults.CAMERA_VIEW
    state = { ready: false }
    Plot = null

    logCameraView = relayoutData => {
        this.cameraView = relayoutData["scene.camera"]
    }

    componentDidMount() {
        import("plotly.js/lib/core").then(Plotly => {
            Plotly.register([Scatter3d, Mesh3d])
            this.Plot = createPlotlyComponent(Plotly)
            this.setState({ ready: true })
        })
    }

    render() {
        if (!this.state.ready) {
            return <p>Loading your cute robot...</p>
        }

        if (!this.props.hexapod) {
            return null
        }
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
        const Plot = this.Plot
        return <Plot {...props} />
    }
}

export default HexapodPlot
