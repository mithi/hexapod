import React, { Component } from "react"
import { sliderList, Card, BasicButton } from "../generic"
import { DEFAULT_POSE, DEFAULT_PATTERN_PARAMS } from "../../templates"
import { SECTION_NAMES, ANGLE_NAMES, RESET_LABEL } from "../vars"

class LegPatternPage extends Component {
    pageName = SECTION_NAMES.legPatterns

    componentDidMount() {
        this.props.onMount(this.pageName)
    }

    updatePatternPose = (name, value) => {
        const { alpha, beta, gamma } = this.props.params.patternParams
        const patternParams = { alpha, beta, gamma, [name]: Number(value) }

        let newPose = {}

        for (const leg in DEFAULT_POSE) {
            newPose[leg] = patternParams
        }

        this.props.onUpdate(newPose, patternParams)
    }

    reset = () => {
        this.props.onUpdate(DEFAULT_POSE, DEFAULT_PATTERN_PARAMS)
    }

    get sliders() {
        return sliderList({
            names: ANGLE_NAMES,
            values: this.props.params.patternParams,
            handleChange: this.updatePatternPose,
        })
    }

    render = () => (
        <Card title={this.pageName} h="h2">
            <div className="row-container">{this.sliders}</div>
            <BasicButton handleClick={this.reset}>{RESET_LABEL}</BasicButton>
        </Card>
    )
}

export default LegPatternPage
