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
                value={this.state.toggleLabel}
                handleChange={this.toggleMode}
                showLabel={true}
                labelTop={false}
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

    get header() {
        return (
            <div className="row-container flex-wrap">
                <h2>{this.sectionName}</h2>
                {this.toggleSwitch}
            </div>
        )
    }

    render = () => (
        <Card title={this.header} h="div">
            <div className="row-container flex-wrap">{this.NumberInputFields}</div>
            <BasicButton handleClick={this.reset}>{RESET_LABEL}</BasicButton>
        </Card>
    )
}

export default DimensionsWidget
