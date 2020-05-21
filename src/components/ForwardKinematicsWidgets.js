import React, { Component } from 'react';

const LegPoseInputField = props => {
  return (
    <div className="input-field-widget">
      <label htmlFor={props.name} className="label">{props.name}</label>
      <input
        type="number"
        id={props.name}
        value={props.value}
        className="input"
        onChange={e => props.handleChange(props.name, e.target.value)}
        min={-180}
        max={180}
        step={0.5}
      />
    </div>
  )
}

class LegPoseWidgets extends Component {

  updateFieldState = (angle, value) => {
    value = Math.min(Math.max(value, -180), 180)
    this.props.onUpdate(this.props.name, angle, value)
  }

  render() {
    const inputFields = ['alpha', 'beta', 'gamma'].map(name => {
      return <LegPoseInputField key={name} name={name} value={this.props.pose[name]} handleChange={this.updateFieldState}/>
    })

    return (
      <div className="column-container">
        <h3>{this.props.name}</h3>
        <form className="row-container">{inputFields}</form>
      </div>
    )
  }
}

class ForwardKinematicsWidgets extends Component {

  updateState = (name, angle, value) => {
    this.props.onUpdate(name, angle, value)
  }

  render() {
    return (
      <>
        <h2>Forward Kinematics</h2>
        <div className="row-container">
          <LegPoseWidgets name="leftFront" onUpdate={this.updateState} pose={this.props.pose["leftFront"]}/>
          <LegPoseWidgets name="rightFront" onUpdate={this.updateState} pose={this.props.pose["rightFront"]}/>
        </div>
        <div className="row-container">
        <LegPoseWidgets name="leftMiddle" onUpdate={this.updateState} pose={this.props.pose["leftMiddle"]}/>
          <LegPoseWidgets name="rightMiddle" onUpdate={this.updateState} pose={this.props.pose["RightMiddle"]}/>
        </div>
        <div className="row-container">
        <LegPoseWidgets name="leftBack" onUpdate={this.updateState} pose={this.props.pose["leftBack"]}/>
          <LegPoseWidgets name="rightBack" onUpdate={this.updateState} pose={this.props.pose["rightBack"]}/>
        </div>
      </>
    )
  }
}

export default ForwardKinematicsWidgets