import React, { Component } from "react"
import InputField from "./generic/InputFieldWidget"

class DimensionWidgets extends Component {
    updateFieldState = (name, value) => {
        value = value > 0 ? value : 0
        this.props.onUpdate(name, Math.round(value))
    }

    render() {
        const inputFields = Object.keys(this.props.dimensions).map(name => (
            <InputField
                key={name}
                name={name}
                params={[0, -Infinity, 1]}
                value={this.props.dimensions[name]}
                handleChange={this.updateFieldState}
            />
        ))

        return (
            <>
                <h2>Dimensions</h2>
                <form className="row-container">{inputFields}</form>
            </>
        )
    }
}

export default DimensionWidgets
