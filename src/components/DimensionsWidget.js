import React, { Component } from "react"
import InputField from "./generic/InputField"
import { Card } from "./generic/SmallWidgets"

const ResetButton = ({reset, children }) => (
    <button type="button" class="button" onClick={reset}>
        {children}
    </button>
)

class DimensionsWidget extends Component {
    resetLabel = "Reset"

    reset = () => {
        this.props.onReset("Dimensions")
    }

    updateFieldState = (name, value) => {
        this.props.onUpdate(name, Math.round(value))
    }

    inputFields = () =>
        Object.keys(this.props.dimensions).map(name => (
            <InputField
                key={name}
                name={name}
                params={[0, Infinity, 1]}
                value={this.props.dimensions[name]}
                handleChange={this.updateFieldState}
            />
        ))

    render = () => (
        <Card title="Dimensions" h="h2">
            <div className="row-container flex-wrap">{this.inputFields()}</div>
            <ResetButton reset={this.reset} widgetName="dimensions">
                {this.resetLabel}
            </ResetButton>
        </Card>
    )
}

export default DimensionsWidget
