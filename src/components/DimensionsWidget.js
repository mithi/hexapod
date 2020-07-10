import React, { Component } from "react"
import NumberInputField from "./generic/NumberInputField"
import { Card, BasicButton, ToggleSwitch } from "./generic/SmallWidgets"
import { DEFAULT_DIMENSIONS } from "../templates"
import { SECTION_NAMES, DIMENSION_NAMES, RESET_LABEL, RANGE_PARAMS } from "./vars"

class DimensionsWidget extends Component {
    sectionName = SECTION_NAMES.dimensions
    state = { isFine: true, granularity: 1 }

    componentDidMount() {
        this.setState({ granularity: 1, toggleLabel: "1x" })
    }

    reset = () => {
        const dimensions = DEFAULT_DIMENSIONS
        this.props.onUpdate(dimensions)
    }

    toggleMode = () => {
        const isFine = !this.state.isFine
        this.setState({
            isFine,
            granularity: isFine ? 1 : 5,
            toggleLabel: isFine ? "1x" : "5x",
        })
    }

    updateDimensions = (name, value) => {
        const dimensions = { ...this.props.params.dimensions, [name]: value }
        this.props.onUpdate(dimensions)
    }

    updateFieldState = (name, value) => {
        this.updateDimensions(name, value)
    }

    get toggleSwitch() {
        return (
            <ToggleSwitch
                id="DimensionsWidgetSwitch"
                value={this.state.toggleLabel}
                handleChange={this.toggleMode}
                showValue={true}
            />
        )
    }

    get NumberInputFields() {
        const { minVal, maxVal } = RANGE_PARAMS.dimensionInputs
        return DIMENSION_NAMES.map(name => (
            <NumberInputField
                key={name}
                name={name}
                rangeParams={{ minVal, maxVal, stepVal: this.state.granularity }}
                value={this.props.params.dimensions[name]}
                handleChange={this.updateFieldState}
            />
        ))
    }

    render = () => (
        <Card title={<h2>{this.sectionName}</h2>} other={this.toggleSwitch}>
            <div className="grid-cols-6">{this.NumberInputFields}</div>
            <BasicButton handleClick={this.reset}>{RESET_LABEL}</BasicButton>
        </Card>
    )
}

export default DimensionsWidget
