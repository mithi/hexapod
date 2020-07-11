import React, { Component } from "react"
import NumberInputField from "./generic/NumberInputField"
import { Card, ResetButton, ToggleSwitch } from "./generic/SmallWidgets"
import { DEFAULT_DIMENSIONS } from "../templates"
import { SECTION_NAMES, DIMENSION_NAMES, RANGE_PARAMS } from "./vars"

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

    toggleMode = () => this.setState({ isFine: !this.state.isFine })

    updateDimensions = (name, value) => {
        const dimensions = { ...this.props.params.dimensions, [name]: value }
        this.props.onUpdate(dimensions)
    }

    updateFieldState = (name, value) => this.updateDimensions(name, value)

    get toggleSwitch() {
        const props = {
            id: "DimensionsWidgetSwitch",
            value: this.state.isFine ? "1x" : "5x",
            handleChange: this.toggleMode,
            showValue: true,
        }

        return <ToggleSwitch {...props} />
    }

    get NumberInputFields() {
        const { minVal, maxVal } = RANGE_PARAMS.dimensionInputs
        const stepVal = this.state.isFine ? 1 : 5
        const dimensions = this.props.params.dimensions

        const numberInputFields = DIMENSION_NAMES.map(name => {
            const props = {
                name,
                key: name,
                value: dimensions[name],
                rangeParams: { minVal, maxVal, stepVal },
                handleChange: this.updateFieldState,
            }

            return <NumberInputField {...props} />
        })

        return <div className="grid-cols-6">{numberInputFields}</div>
    }

    render = () => (
        <Card title={<h2>{this.sectionName}</h2>} other={this.toggleSwitch}>
            {this.NumberInputFields}
            <ResetButton reset={this.reset} />
        </Card>
    )
}

export default DimensionsWidget
