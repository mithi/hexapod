import React, { Component } from "react"
import LegPoseWidget from './LegPoseWidgetDefault'

class ForwardKinematicsWidgets extends Component {
  componentDidMount() {
    this.props.onMount()
  }

  makeRow = (legName1, legName2) => {
    const legPoseWidget = [legName1, legName2].map((name) => {
      return (
        <LegPoseWidget
          key={name}
          name={name}
          pose={this.props.pose[name]}
          onUpdate={this.props.onUpdate}
        />
      )
    })

    return <div className="row-container"> {legPoseWidget} </div>
  }


  render() {
    return (
      <>
        <h2>Forward Kinematics</h2>
        {this.makeRow("leftFront", "rightFront")}
        {this.makeRow("leftMiddle", "rightMiddle")}
        {this.makeRow("leftBack", "rightBack")}
      </>
    )
  }
}

export default ForwardKinematicsWidgets
