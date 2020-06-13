import React, { Component } from "react"
import InputField from "./generic/InputField"
import { Card } from "./generic/SmallWidgets"
import { DEFAULT_DIMENSIONS } from "../templates"

const BasicButton = ({ handleClick, children }) => (
    <button type="button" className="button" onClick={handleClick}>
        {children}
    </button>
)

class DimensionsWidget extends Component {
    resetLabel = "Reset"

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

    inputFields = () =>
        Object.keys(this.props.params.dimensions).map(name => (
            <InputField
                key={name}
                name={name}
                params={[0, Infinity, 1]}
                value={this.props.params.dimensions[name]}
                handleChange={this.updateFieldState}
            />
        ))

    render = () => (
        <Card title="Dimensions" h="h2">
            <div className="row-container flex-wrap">{this.inputFields()}</div>
            <BasicButton handleClick={this.reset} widgetName="dimensions">
                {this.resetLabel}
            </BasicButton>
        </Card>
    )
}

export default DimensionsWidget
