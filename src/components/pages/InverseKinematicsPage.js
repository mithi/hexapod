import React, { Component } from "react"
import { sliderList, Card, BasicButton, AlertBox } from "../generic"
import { solveInverseKinematics } from "../../hexapod"
import { SECTION_NAMES, IK_SLIDERS_LABELS, RESET_LABEL } from "../vars"
import { DEFAULT_IK_PARAMS, DEFAULT_POSE } from "../../templates"
import PoseTable from "./PoseTable"

class InverseKinematicsPage extends Component {
    pageName = SECTION_NAMES.inverseKinematics
    state = { ikParams: DEFAULT_IK_PARAMS, errorMessage: null, pose: DEFAULT_POSE }

    componentDidMount = () => this.props.onMount(this.pageName)

    updateIkParams = (name, value) => {
        const ikParams = { ...this.state.ikParams, [name]: value }
        const result = solveInverseKinematics(this.props.params.dimensions, ikParams)

        if (!result.obtainedSolution) {
            this.props.onUpdate(null)
            this.setState({ errorMessage: result.message, pose: null })
            return
        }

        this.update(result.hexapod, ikParams)
    }

    reset = () => {
        const result = solveInverseKinematics(
            this.props.params.dimensions,
            DEFAULT_IK_PARAMS
        )
        this.update(result.hexapod, DEFAULT_IK_PARAMS)
    }

    update = (hexapod, ikParams) => {
        this.setState({
            ikParams,
            errorMessage: null,
            pose: hexapod.pose,
        })

        this.props.onUpdate(hexapod)
    }

    get sliders() {
        return sliderList({
            names: IK_SLIDERS_LABELS,
            values: this.state.ikParams,
            handleChange: this.updateIkParams,
        })
    }

    get additionalInfo() {
        const { pose, errorMessage } = this.state
        return errorMessage ? <AlertBox info={errorMessage} /> : <PoseTable pose={pose} />
    }

    render = () => (
        <Card title={<h2>{this.pageName}</h2>}>
            <div className="grid-cols-3">{this.sliders.slice(0, 6)}</div>
            <div className="grid-cols-2">{this.sliders.slice(6, 8)}</div>
            <BasicButton handleClick={this.reset}>{RESET_LABEL}</BasicButton>
            {this.additionalInfo}
        </Card>
    )
}

export default InverseKinematicsPage
