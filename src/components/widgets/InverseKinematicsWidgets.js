import React, { Component } from "react"
import Slider from "./SliderWidget"

class InverseKinematicsWidgets extends Component {
    componentDidMount() {
        this.props.onMount()
    }

    render() {
        const translateSliders = ["tx", "ty", "tz"].map(name => {
            return (
                <Slider
                    key={name}
                    name={name}
                    params={[-1, 1, 0.01]}
                    handleChange={this.props.onUpdate}
                    value={this.props.params[name]}
                />
            )
        })

        const rotateSliders = ["rx", "ry", "rz", "hipStance", "legStance"].map(
            name => {
                return (
                    <Slider
                        key={name}
                        name={name}
                        params={[-45, 45, 0.01]}
                        handleChange={this.props.onUpdate}
                        value={this.props.params[name]}
                    />
                )
            }
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
