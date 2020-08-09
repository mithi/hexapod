import React from "react"
import createPlotlyComponent from "react-plotly.js/factory"
import * as defaults from "../templates"
import getNewPlotParams from "../templates/plotter"

class HexapodPlot extends React.Component {
    cameraView = defaults.CAMERA_VIEW
    state = { ready: false }
    Plot = null

    logCameraView = relayoutData => {
        this.cameraView = relayoutData["scene.camera"]
    }

    componentDidMount() {
        import("plotly.js-gl3d-dist-min").then(Plotly => {
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
