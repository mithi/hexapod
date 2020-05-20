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

  state = {
    alpha: 0,
    beta: 0,
    gamma: 0,
  }

  updateFieldState = (name, value) => {
    value = Math.min(Math.max(value, -180), 180)
    this.setState({ [name]: value })
  }

  render() {
    const inputFields = Object.keys(this.state).map(name => {
      return <LegPoseInputField key={name} name={name} value={this.state[name]} handleChange={this.updateFieldState}/>
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
  render() {
    return (
      <>
        <h2>Forward Kinematics</h2>
        <div className="row-container">
          <LegPoseWidgets name="left-front"/>
          <LegPoseWidgets name="right-front"/>
        </div>
        <div className="row-container">
        <LegPoseWidgets name="left-middle"/>
          <LegPoseWidgets name="right-middle"/>
        </div>
        <div className="row-container">
        <LegPoseWidgets name="left-back"/>
          <LegPoseWidgets name="right-back"/>
        </div>
      </>
    )
  }
}

export default ForwardKinematicsWidgets