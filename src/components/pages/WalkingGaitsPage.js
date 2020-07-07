import React, { Component } from "react"
import { sliderList, Card } from "../generic"
import { SECTION_NAMES } from "../vars"

const SLIDER_LABELS = [
    "stepCnt", "rx", "ry", "tz", "legStance", "hipStance", "hipSwing", "liftSwing"
]

const PARAMS = {
    tz: { minVal: -0.5, maxVal: 0.5, stepVal: 0.01, defaultVal: 0 },
    rx: { minVal: -15, maxVal: 15, stepVal: 0.01, defaultVal: 0 },
    ry: { minVal: -15, maxVal: 15, stepVal: 0.01, defaultVal: 0 },
    legStance: { minVal: -60, maxVal: 60, stepVal: 0.01, defaultVal: 0 },
    hipStance: { minVal: 10, maxVal: 40, stepVal: 0.01, defaultVal: 25 },
    hipSwing: { minVal: 0, maxVal: 30, stepVal: 0.01, defaultVal: 15 },
    liftSwing: { minVal: 0, maxVal: 50, stepVal: 0.01, defaultVal: 25 },
    stepCnt: { minVal: 3, maxVal: 9, stepVal: 1, defaultVal: 6 },
}

const DEFAULT_GAIT_VARS = SLIDER_LABELS.reduce((gaitParams, gaitVar) => {
    gaitParams[gaitVar] = PARAMS[gaitVar].defaultVal
    return gaitParams
}, {})

class WalkingGaitsPage extends Component {
    pageName = SECTION_NAMES.walkingGaits
    state = { gaitParams: DEFAULT_GAIT_VARS}

    componentDidMount() {
        this.props.onMount(this.pageName)

        this.setState({ gaitParams: DEFAULT_GAIT_VARS })
    }

    updateGaitParams = (name, value) => {
        const gaitParams = { ...this.state.gaitParams, [name]: value }
        this.setState({ gaitParams })
    }

    get sliders() {
        return sliderList({
            names: SLIDER_LABELS,
            values: this.state.gaitParams,
            rangeParams: PARAMS,
            handleChange: this.updateGaitParams,
        })
    }

    render = () => {
        const sliders = this.sliders

        return (
            <Card title={this.pageName} h="h2">
                <div className="row-container">{sliders.slice(0, 4)}</div>
                <div className="row-container">{sliders.slice(4, 6)}</div>
                <div className="row-container">{sliders.slice(6, 8)}</div>
            </Card>
        )
    }
}

export default WalkingGaitsPage
