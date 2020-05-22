import React, { Component } from "react"
import Slider from "./generic/SliderWidget"

class InverseKinematicsWidgets extends Component {
    componentDidMount() {
        this.props.onMount()
    }

    sliderList(sliderNames, params) {
        return sliderNames.map(name => {
            return (
                <Slider
                    key={name}
                    name={name}
                    params={params}
                    handleChange={this.props.onUpdate}
                    value={this.props.params[name]}
                />
            )
        })
    }
    render() {
        const translateSliders = this.sliderList(["tx", "ty", "tz"], [-1, 1, 0.01])
        const rotateSliders = this.sliderList(
            ["rx", "ry", "rz", "hipStance", "legStance"],
            [-45, 45, 0.01]
        )
        return (
            <div>
                <h2>Inverse Kinematics</h2>
                <div className="row-container">{translateSliders}</div>
                <div className="row-container">{rotateSliders.slice(0, 3)}</div>
                <div className="row-container">{rotateSliders.slice(3, 5)}</div>
            </div>
        )
    }
}

export default InverseKinematicsWidgets
