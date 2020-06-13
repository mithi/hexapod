import React, { Component } from "react"
import InputField from "./generic/InputField"
import { Card, BasicButton } from "./generic/SmallWidgets"
import { DEFAULT_DIMENSIONS } from "../templates"

class DimensionsWidget extends Component {
    reset = () => {
        const dimensions = DEFAULT_DIMENSIONS
        this.props.onUpdate(dimensions)
    }

    updateDimensions = (name, value) => {
        const dimensions = { ...this.props.params.dimensions, [name]: value }
        this.props.onUpdate(dimensions)
    }

    updateFieldState = (name, value) => {
        this.updateDimensions(name, Math.round(value))
    }

    get inputFields() {
        return Object.keys(this.props.params.dimensions).map(name => (
            <InputField
                key={name}
                name={name}
                params={[0, Infinity, 1]}
                value={this.props.params.dimensions[name]}
                handleChange={this.updateFieldState}
            />
        ))
    }

    get resetButton() {
        return <BasicButton handleClick={this.reset}>Reset</BasicButton>
    }

    render = () => (
        <Card title="Dimensions" h="h2">
            <div className="row-container flex-wrap">{this.inputFields}</div>
            {this.resetButton}
        </Card>
    )
}

export default DimensionsWidget
