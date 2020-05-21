import React, { Component } from "react"

const TranslateSlider = (props) => {
  return (
    <div className="slider-container cell">
      <label htmlFor={props.name} className="label">
        {props.name}: {props.value}
      </label>
      <input
        type="range"
        min={-1.0}
        max={1.0}
        step={0.01}
        value={props.value}
        onChange={(e) => props.handleChange(props.name, e.target.value)}
        className="slider"
      />
    </div>
  )
}

const RotateSlider = (props) => {
  return (
    <div className="slider-container cell">
      <label htmlFor={props.name} className="label">
        {props.name}: {props.value}
      </label>
      <input
        type="range"
        min={-45}
        max={45}
        step={0.5}
        value={props.value}
        onChange={(e) => props.handleChange(props.name, e.target.value)}
        className="slider"
      />
    </div>
  )
}

const StanceSlider = (props) => {
  return (
    <div className="slider-container cell">
      <label htmlFor={props.name} className="label">
        {props.name}: {props.value}
      </label>
      <input
        type="range"
        min={-45}
        max={45}
        step={0.5}
        value={props.value}
        onChange={(e) => props.handleChange(props.name, e.target.value)}
        className="slider"
      />
    </div>
  )
}

class InverseKinematicsWidgets extends Component {
  render() {
    const translateSliders = ["tx", "ty", "tz"].map((name) => {
      return (
        <TranslateSlider
          key={name}
          name={name}
          handleChange={this.props.onUpdate}
          value={this.props.params[name]}
        />
      )
    })

    const rotateSliders = ["rx", "ry", "rz"].map((name) => {
      return (
        <RotateSlider
          key={name}
          name={name}
          handleChange={this.props.onUpdate}
          value={this.props.params[name]}
        />
      )
    })

    const stanceSliders = ["hipStance", "legStance"].map((name) => {
      return (
        <StanceSlider
          name={name}
          handleChange={this.props.onUpdate}
          value={this.props.params[name]}
        />
      )
    })

    return (
      <div>
        <h2>Inverse Kinematics</h2>
        <div className="row-container">{translateSliders}</div>
        <div className="row-container">{rotateSliders}</div>
        <div className="row-container">{stanceSliders}</div>
      </div>
    )
  }
}

export default InverseKinematicsWidgets
