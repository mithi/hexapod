import React, { Component } from "react"
import InputField from "./generic/InputFieldWidget"
import { Card } from "./generic/SmallWidgets"

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

    inputFields = () =>
        Object.keys(this.props.pose).map(name => (
            <InputField
                key={name}
                name={name}
                params={[-180, 180, 0.01]}
                value={this.props.pose[name]}
                handleChange={this.updateFieldState}
            />
        ))

    render = () => (
        <Card title={this.props.name} h="h3" klass="column-container">
            <form className="row-container flex-wrap">{this.inputFields()}</form>
        </Card>
    )
}

export default LegPoseWidget
