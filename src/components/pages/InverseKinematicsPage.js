import React, { Component } from "react"
import { sliderList, Card } from "../generic"
import { solveInverseKinematics } from "../../hexapod"

class InverseKinematicsPage extends Component {
    pageName = "Inverse Kinematics"

    componentDidMount() {
        this.props.onMount(this.pageName)
    }

    updateIkParams = (name, value) => {
        const ikParams = { ...this.props.params.ikParams, [name]: value }

        const result = solveInverseKinematics(this.props.params.dimensions, ikParams)

        if (!result.obtainedSolution) {
            const updatedStateParams = {
                ikParams,
                showPoseMessage: false,
                showInfo: true,
                info: { ...result.message, isAlert: true },
            }

            this.props.onUpdate(null, updatedStateParams)
            return
        }

        const updatedStateParams = {
            ikParams,
            showPoseMessage: true,
            showInfo: false,
            info: { ...result.message, isAlert: false },
        }

        this.props.onUpdate(result.hexapod, updatedStateParams)
    }

    render() {
        const {
            rx,
            ry,
            rz,
            tx,
            ty,
            tz,
            hipStance,
            legStance,
        } = this.props.params.ikParams

        const translateSliders = sliderList(["tx", "ty", "tz"], [-1, 1, 0.01], {
            onUpdate: this.updateIkParams,
            params: { tx, ty, tz },
        })

        const rotateSliders = sliderList(
            ["rx", "ry", "rz", "hipStance", "legStance"],
            [-45, 45, 0.01],
            {
                onUpdate: this.updateIkParams,
                params: { rx, ry, rz, hipStance, legStance },
            }
        )

        return (
            <Card title={this.pageName} h="h2">
                <div className="row-container">{translateSliders}</div>
                <div className="row-container">{rotateSliders.slice(0, 3)}</div>
                <div className="row-container">{rotateSliders.slice(3)}</div>
            </Card>
        )
    }
}

export default InverseKinematicsPage
