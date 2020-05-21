import React, { Component } from "react"

const LegPoseInputField = (props) => {
  return (
    <div className="cell">
      <label htmlFor={props.name} className="label">
        {props.name}
      </label>
      <input
        type="number"
        id={props.name}
        value={props.value}
        className="input"
        onChange={(e) => props.handleChange(props.name, e.target.value)}
        min={-180}
        max={180}
        step={0.5}
      />
    </div>
  )
}

class LegPoseWidget extends Component {
  updateFieldState = (angle, value) => {
    value = Math.min(Math.max(value, -180), 180)
    this.props.onUpdate(this.props.name, angle, value)
  }

  render() {
    const inputFields = Object.keys(this.props.pose).map((name) => {
      return (
        <LegPoseInputField
          key={name}
          name={name}
          value={this.props.pose[name]}
          handleChange={this.updateFieldState}
        />
      )
    })

    return (
      <div className="column-container">
        <h3>{this.props.name}</h3>
        <form className="row-container">{inputFields}</form>
      </div>
    )
  }
}

export default LegPoseWidget
