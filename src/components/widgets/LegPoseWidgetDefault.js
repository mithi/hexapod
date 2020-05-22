import React, { Component } from "react"
import InputField from "./generic/InputFieldWidget"

class LegPoseWidget extends Component {
    updateFieldState = (angle, value) => {
        if (value === "") {
            value = -1
        } else {
            value = Math.round(value * 100) / 100
            value = Math.min(Math.max(value, -180), 180)
        }
        this.props.onUpdate(this.props.name, angle, value)
    }

    render() {
        const inputFields = Object.keys(this.props.pose).map(name => {
            return (
                <InputField
                    key={name}
                    name={name}
                    params={[-180, 180, 0.01]}
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
