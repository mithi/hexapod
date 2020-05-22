import React, { Component } from "react"
import LegPoseWidget from "./LegPoseWidgetDefault"

class ForwardKinematicsWidgets extends Component {
    componentDidMount() {
        this.props.onMount()
    }

    makeRow = (legName1, legName2) => (
        <div className="row-container">
            {[legName1, legName2].map(name => (
                <LegPoseWidget
                    key={name}
                    name={name}
                    pose={this.props.pose[name]}
                    onUpdate={this.props.onUpdate}
                />
            ))}
        </div>
    )

    render = () => (
        <>
            <h2>Forward Kinematics</h2>
            {this.makeRow("leftFront", "rightFront")}
            {this.makeRow("leftMiddle", "rightMiddle")}
            {this.makeRow("leftBack", "rightBack")}
        </>
    )
}

export default ForwardKinematicsWidgets
