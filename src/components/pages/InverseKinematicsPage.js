import React, { Component } from "react"
import { sliderList } from "../generic/Slider"
import { Card } from "../generic/SmallWidgets"

class InverseKinematicsPage extends Component {
    pageName = "Inverse Kinematics"

    componentDidMount() {
        this.props.onMount(this.pageName)
    }

    render() {
        const translateSliders = sliderList(
            ["tx", "ty", "tz"],
            [-1, 1, 0.01],
            this.props
        )

        const rotateSliders = sliderList(
            ["rx", "ry", "rz", "hipStance", "legStance"],
            [-45, 45, 0.01],
            this.props
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
