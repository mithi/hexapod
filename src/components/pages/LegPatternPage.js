import React, { Component } from "react"
import { sliderList, Card, BasicButton } from "../generic"
import { DEFAULT_POSE, DEFAULT_PATTERN_PARAMS } from "../../templates"
import { SECTION_NAMES, ANGLE_NAMES } from "../texts"

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

    get resetButton() {
        return <BasicButton handleClick={this.reset}>Reset</BasicButton>
    }

    get rotateSliders() {
        return sliderList(ANGLE_NAMES, [-180, 180, 1], {
            onUpdate: this.updatePatternPose,
            params: this.props.params.patternParams,
        })
    }

    render = () => (
        <Card title={this.pageName} h="h2">
            <div className="row-container">{this.rotateSliders}</div>
            {this.resetButton}
        </Card>
    )
}

export default LegPatternPage
