import React, { Component } from "react"
import { sliderList, Card, BasicButton } from "../generic"
import { DEFAULT_POSE, DEFAULT_PATTERN_PARAMS } from "../../templates"
import { SECTION_NAMES, ANGLE_NAMES, RESET_LABEL } from "../vars"
import { usePageLoad, useUpdatePose } from "../providers/Handlers"

class LegPatternPage extends Component {
    pageName = SECTION_NAMES.legPatterns
    state = { patternParams: DEFAULT_PATTERN_PARAMS }

    componentDidMount() {
        this.props.onMount(this.pageName)
        this.setState({ patternParams: DEFAULT_PATTERN_PARAMS })
    }

    updatePatternPose = (name, value) => {
        const patternParams = { ...this.state.patternParams, [name]: Number(value) }
        let newPose = {}

        for (const leg in DEFAULT_POSE) {
            newPose[leg] = patternParams
        }

        this.props.onUpdate(newPose)
        this.setState({ patternParams })
    }

    reset = () => {
        this.props.onUpdate(DEFAULT_POSE)
        this.setState({ patternParams: DEFAULT_PATTERN_PARAMS })
    }

    get sliders() {
        return sliderList({
            names: ANGLE_NAMES,
            values: this.state.patternParams,
            handleChange: this.updatePatternPose,
        })
    }

    render = () => (
        <Card title={this.pageName} h="h2">
            <div className="leg-sliders-container">{this.sliders}</div>
            <BasicButton handleClick={this.reset}>{RESET_LABEL}</BasicButton>
        </Card>
    )
}

const WithHandlers = props => {
    const onMount = usePageLoad()
    const onUpdate = useUpdatePose()
    return <LegPatternPage {...props} onMount={onMount} onUpdate={onUpdate} />
}

WithHandlers.displayName = "WithHandlers(LegPatternPage)"

export default WithHandlers
