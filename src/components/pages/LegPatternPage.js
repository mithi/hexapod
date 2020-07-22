import React, { Component } from "react"
import { sliderList, Card, ResetButton } from "../generic"
import { DEFAULT_POSE, DEFAULT_PATTERN_PARAMS } from "../../templates"
import { SECTION_NAMES, ANGLE_NAMES } from "../vars"

class LegPatternPage extends Component {
    pageName = SECTION_NAMES.legPatterns
    state = { patternParams: DEFAULT_PATTERN_PARAMS }

    componentDidMount = () => {
        this.props.onMount(this.pageName)
        this.reset()
    }

    reset = () => {
        this.props.onUpdate("pose", { pose: DEFAULT_POSE })
        this.setState({ patternParams: DEFAULT_PATTERN_PARAMS })
    }

    updatePatternPose = (name, value) => {
        const patternParams = { ...this.state.patternParams, [name]: Number(value) }
        let newPose = {}

        for (const leg in DEFAULT_POSE) {
            newPose[leg] = patternParams
        }

        this.props.onUpdate("pose", { pose: newPose })
        this.setState({ patternParams })
    }

    get sliders() {
        return sliderList({
            names: ANGLE_NAMES,
            values: this.state.patternParams,
            handleChange: this.updatePatternPose,
        })
    }

    render = () => (
        <Card title={<h2>{this.pageName}</h2>}>
            <div className="grid-cols-1">{this.sliders}</div>
            <ResetButton reset={this.reset} />
        </Card>
    )
}

export default LegPatternPage
