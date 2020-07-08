import React, { Component } from "react"
import { sliderList, Card, BasicButton, AlertBox } from "../generic"
import { solveInverseKinematics } from "../../hexapod"
import { SECTION_NAMES, IK_SLIDERS_LABELS, RESET_LABEL } from "../vars"
import { DEFAULT_IK_PARAMS, DEFAULT_POSE } from "../../templates"
import { withHandlers } from "../providers/Handlers"
import { withHexapodParams } from "../providers/HexapodParams"

import { PoseTable } from ".."

class InverseKinematicsPage extends Component {
    pageName = SECTION_NAMES.inverseKinematics
    state = { ikParams: DEFAULT_IK_PARAMS, errorMessage: null, pose: DEFAULT_POSE }

    componentDidMount() {
        this.props.onMount(this.pageName)
    }

    updateIkParams = (name, value) => {
        const ikParams = { ...this.state.ikParams, [name]: value }
        const result = solveInverseKinematics(this.props.params.dimensions, ikParams)

        if (!result.obtainedSolution) {
            return this.setState(
                { errorMessage: result.message, pose: null, ikParams },
                () => this.props.onUpdateHexapod(null)
            )
        }

        return this.update(result.hexapod, ikParams)
    }

    reset = () => {
        const result = solveInverseKinematics(
            this.props.params.dimensions,
            DEFAULT_IK_PARAMS
        )
        this.update(result.hexapod, DEFAULT_IK_PARAMS)
    }

    update = (hexapod, ikParams) => {
        return this.setState(
            {
                ikParams: ikParams,
                errorMessage: null,
                pose: hexapod.pose,
            },
            () => this.props.onUpdateHexapod(hexapod)
        )
    }

    get sliders() {
        return sliderList({
            names: IK_SLIDERS_LABELS,
            values: this.state.ikParams,
            handleChange: this.updateIkParams,
        })
    }

    get additionalInfo() {
        if (this.state.errorMessage === null) {
            return <PoseTable pose={this.state.pose} />
        } else {
            return <AlertBox info={this.state.errorMessage} />
        }
    }

    render() {
        const sliders = this.sliders
        return (
            <Card title={this.pageName} h="h2">
                <div className="row-container">{sliders.slice(0, 3)}</div>
                <div className="row-container">{sliders.slice(3, 6)}</div>
                <div className="row-container">{sliders.slice(6, 8)}</div>
                <BasicButton handleClick={this.reset}>{RESET_LABEL}</BasicButton>
                {this.additionalInfo}
            </Card>
        )
    }
}

export default withHexapodParams(
    withHandlers(InverseKinematicsPage),
    ({ dimensions }) => ({ params: { dimensions } })
)
