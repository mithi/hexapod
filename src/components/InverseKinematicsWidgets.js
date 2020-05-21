import React, { Component } from "react"

const TranslateSlider = (props) => {
  return (
    <div className="slider-container">
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
    <div className="slider-container">
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
    <div className="slider-container">
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
  state = {
    tx: 0,
    ty: 0,
    tz: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    hipStance: 0,
    legStance: 0,
  }

  updateFieldState = (name, value) => {
    this.setState({ [name]: value })
  }
  render() {
    return (
      <>
        <h2>Inverse Kinematics</h2>
        <div className="row-container">
          <TranslateSlider
            name="tx"
            handleChange={this.updateFieldState}
            value={this.state.tx}
          />
          <TranslateSlider
            name="ty"
            handleChange={this.updateFieldState}
            value={this.state.ty}
          />
          <TranslateSlider
            name="tz"
            handleChange={this.updateFieldState}
            value={this.state.tz}
          />
        </div>
        <div className="row-container">
          <RotateSlider
            name="rx"
            handleChange={this.updateFieldState}
            value={this.state.rx}
          />
          <RotateSlider
            name="ry"
            handleChange={this.updateFieldState}
            value={this.state.ry}
          />
          <RotateSlider
            name="rz"
            handleChange={this.updateFieldState}
            value={this.state.rz}
          />
        </div>
        <div className="row-container">
          <StanceSlider
            name="hipStance"
            handleChange={this.updateFieldState}
            value={this.state.hipStance}
          />
          <StanceSlider
            name="legStance"
            handleChange={this.updateFieldState}
            value={this.state.legStance}
          />
        </div>
      </>
    )
  }
}

export default InverseKinematicsWidgets
