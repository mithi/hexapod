import React, { Component } from "react"
import { sliderList, Card, BasicButton } from "../generic"
import { solveInverseKinematics } from "../../hexapod"
import { SECTION_NAMES, IK_SLIDERS_LABELS, RESET_LABEL } from "../vars"
import { DEFAULT_IK_PARAMS } from "../../templates"

const _updatedStateParamsUnsolved = message => ({
    showPoseMessage: false,
    showInfo: true,
    info: { ...message, isAlert: true },
})

const _updatedStateParamsSolved = message => ({
    showPoseMessage: true,
    showInfo: false,
    info: { ...message, isAlert: false },
})

class InverseKinematicsPage extends Component {
    pageName = SECTION_NAMES.inverseKinematics
    state = { ikParams: DEFAULT_IK_PARAMS }

    componentDidMount() {
        this.props.onMount(this.pageName)
    }

    updateIkParams = (name, value) => {
        const ikParams = { ...this.state.ikParams, [name]: value }
        this.setState({ ikParams })

        const result = solveInverseKinematics(this.props.params.dimensions, ikParams)

        if (!result.obtainedSolution) {
            const stateParams = _updatedStateParamsUnsolved(result.message)
            this.props.onUpdate(null, stateParams)
            return
        }

        const stateParams = _updatedStateParamsSolved(result.message)
        this.props.onUpdate(result.hexapod, stateParams)
    }

    reset = () => {
        this.setState({ DEFAULT_IK_PARAMS })
        const result = solveInverseKinematics(
            this.props.params.dimensions,
            DEFAULT_IK_PARAMS
        )
        const stateParams = _updatedStateParamsSolved(result.message)
        this.props.onUpdate(result.hexapod, stateParams)
    }

    get sliders() {
        return sliderList({
            names: IK_SLIDERS_LABELS,
            values: this.state.ikParams,
            handleChange: this.updateIkParams,
        })
    }

    render() {
        const sliders = this.sliders

        return (
            <Card title={this.pageName} h="h2">
                <div className="row-container">{sliders.slice(0, 3)}</div>
                <div className="row-container">{sliders.slice(3, 6)}</div>
                <div className="row-container">{sliders.slice(6, 8)}</div>
                <BasicButton handleClick={this.reset}>{RESET_LABEL}</BasicButton>
            </Card>
        )
    }
}

export default InverseKinematicsPage
