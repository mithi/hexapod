import React, { Component } from "react"
import InputField from "./generic/InputFieldWidget"
import { Card } from "./generic/SmallWidgets"

class DimensionWidgets extends Component {
    updateFieldState = (name, value) => {
        value = value > 0 ? value : 0
        this.props.onUpdate(name, Math.round(value))
    }

    inputFields = () =>
        Object.keys(this.props.dimensions).map(name => (
            <InputField
                key={name}
                name={name}
                params={[0, -Infinity, 1]}
                value={this.props.dimensions[name]}
                handleChange={this.updateFieldState}
            />
        ))

    render = () => (
        <Card title="Dimensions" h="h2">
            <div className="row-container">{this.inputFields()}</div>
        </Card>
    )
}

export default DimensionWidgets
