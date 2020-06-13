import React, { Component } from "react"
import { sliderList, Card, BasicButton } from "../generic"
import { solveInverseKinematics } from "../../hexapod"
import { DEFAULT_IK_PARAMS } from "../../templates"

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
    pageName = "Inverse Kinematics"

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

    get resetButton() {
        return <BasicButton handleClick={this.reset}>Reset</BasicButton>
    }

    get rotateSliders() {
        const { rx, ry, rz, hipStance, legStance } = this.props.params.ikParams
        return sliderList(
            ["rx", "ry", "rz", "hipStance", "legStance"],
            [-45, 45, 0.01],
            {
                onUpdate: this.updateIkParams,
                params: { rx, ry, rz, hipStance, legStance },
            }
        )
    }

    get translateSliders() {
        const { tx, ty, tz } = this.props.params.ikParams
        return sliderList(["tx", "ty", "tz"], [-1, 1, 0.01], {
            onUpdate: this.updateIkParams,
            params: { tx, ty, tz },
        })
    }

    render() {
        const rotateSliders = this.rotateSliders

        return (
            <Card title={this.pageName} h="h2">
                <div className="row-container">{this.translateSliders}</div>
                <div className="row-container">{rotateSliders.slice(0, 3)}</div>
                <div className="row-container">{rotateSliders.slice(3)}</div>
                {this.resetButton}
            </Card>
        )
    }
}

export default InverseKinematicsPage
