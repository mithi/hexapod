import React, { Component } from "react"
import { sliderList, Card, BasicButton } from "../generic"
import { solveInverseKinematics } from "../../hexapod"
import { DEFAULT_IK_PARAMS } from "../../templates"
import { SECTION_NAMES, IK_SLIDERS_LABELS, RESET_LABEL } from "../vars"

const _updatedStateParamsUnsolved = (ikParams, message) => ({
    ikParams,
    showPoseMessage: false,
    showInfo: true,
    info: { ...message, isAlert: true },
})

const _updatedStateParamsSolved = (ikParams, message) => ({
    ikParams,
    showPoseMessage: true,
    showInfo: false,
    info: { ...message, isAlert: false },
})

class InverseKinematicsPage extends Component {
    pageName = SECTION_NAMES.inverseKinematics

    componentDidMount() {
        this.props.onMount(this.pageName)
    }

    updateIkParams = (name, value) => {
        const ikParams = { ...this.props.params.ikParams, [name]: value }
        const result = solveInverseKinematics(this.props.params.dimensions, ikParams)

        if (!result.obtainedSolution) {
            const stateParams = _updatedStateParamsUnsolved(ikParams, result.message)
            this.props.onUpdate(null, stateParams)
            return
        }

        const stateParams = _updatedStateParamsSolved(ikParams, result.message)
        this.props.onUpdate(result.hexapod, stateParams)
    }

    reset = () => {
        const dimensions = this.props.params.dimensions
        const result = solveInverseKinematics(dimensions, DEFAULT_IK_PARAMS)

        const stateParams = _updatedStateParamsSolved(DEFAULT_IK_PARAMS, result.message)
        this.props.onUpdate(result.hexapod, stateParams)
    }

    get sliders() {
        return sliderList({
            names: IK_SLIDERS_LABELS,
            values: this.props.params.ikParams,
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
