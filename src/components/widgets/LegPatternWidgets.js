import React, { Component } from "react"

const RotateSlider = (props) => {
  return (
    <div className="slider-container cell">
      <label htmlFor={props.name} className="label">
        {props.name}: {props.value}
      </label>
      <input
        type="range"
        min={-180}
        max={180}
        step={0.5}
        value={props.value}
        onChange={(e) => props.handleChange(props.name, e.target.value)}
        className="slider"
      />
    </div>
  )
}

class LegPatternWidgets extends Component {
  componentDidMount() {
    //this.props.onMount()
  }

  render() {
    const rotateSliders = ["alpha", "beta", "gamma"].map((name) => {
      return (
        <RotateSlider
          key={name}
          name={name}
          handleChange={this.props.onUpdate}
          value={this.props.params[name]}
        />
      )
    })

    return (
      <div>
        <h2>leg patterns</h2>
        <div className="row-container">{rotateSliders}</div>
      </div>
    )
  }
}

export default LegPatternWidgets
