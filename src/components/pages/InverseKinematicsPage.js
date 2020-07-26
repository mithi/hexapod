import React, { Component } from "react"
import { sliderList, Card, ResetButton, AlertBox } from "../generic"
import { solveInverseKinematics } from "../../hexapod"
import { SECTION_NAMES, IK_SLIDERS_LABELS } from "../vars"
import { DEFAULT_IK_PARAMS } from "../../templates"
import PoseTable from "../pagePartials/PoseTable"

class InverseKinematicsPage extends Component {
    pageName = SECTION_NAMES.inverseKinematics
    state = { ikParams: DEFAULT_IK_PARAMS, errorMessage: null }

    componentDidMount = () => this.props.onMount(this.pageName)

    reset = () => {
        const result = solveInverseKinematics(
            this.props.params.dimensions,
            DEFAULT_IK_PARAMS
        )
        this.updateHexapodPlot(result.hexapod, DEFAULT_IK_PARAMS)
    }

    updateHexapodPlot = (hexapod, ikParams) => {
        this.setState({ ikParams, errorMessage: null })
        this.props.onUpdate("hexapod", { hexapod })
    }

    updateIkParams = (name, value) => {
        const ikParams = { ...this.state.ikParams, [name]: value }
        const result = solveInverseKinematics(this.props.params.dimensions, ikParams)

        if (!result.obtainedSolution) {
            this.props.onUpdate("hexapod", { hexapod: null })
            this.setState({ errorMessage: result.message })
            return
        }

        this.updateHexapodPlot(result.hexapod, ikParams)
    }

    get sliders() {
        return sliderList({
            names: IK_SLIDERS_LABELS,
            values: this.state.ikParams,
            handleChange: this.updateIkParams,
        })
    }

    get additionalInfo() {
        if (this.state.errorMessage) {
            return <AlertBox info={this.state.errorMessage} />
        }

        return <PoseTable pose={this.props.params.pose} />
    }

    render = () => (
        <Card title={<h2>{this.pageName}</h2>}>
            <div className="grid-cols-3">{this.sliders.slice(0, 6)}</div>
            <div className="grid-cols-2">{this.sliders.slice(6, 8)}</div>
            <ResetButton reset={this.reset} />
            {this.additionalInfo}
        </Card>
    )
}

export default InverseKinematicsPage
