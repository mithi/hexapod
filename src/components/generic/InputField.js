import React, { Component } from "react"

class InputField extends Component {
    state = {
        currentValue: 0,
        parentValue: 0,
        message: null,
    }

    constructor(props) {
        super(props)
        this.myRef = React.createRef()
    }

    componentDidMount() {
        this.setState({
            message: null,
        })
    }

    handleChange(value) {
        const [minValue, maxValue, stepValue] = this.props.params
        const validity = this.myRef.current.validity

        if (validity.badInput) {
            this.setState({ message: "NaN" })
            return
        }

        if (validity.rangeOverflow) {
            this.setState({ message: `max=${maxValue}` })
            return
        }

        if (validity.rangeUnderflow) {
            this.setState({ message: `min=${minValue}` })
            return
        }

        if (validity.stepMismatch) {
            this.setState({ message: `step=${stepValue}` })
            return
        }

        if (!this.myRef.current.checkValidity()) {
            this.setState({ message: "Error" })
            return
        }

        const numberValue = parseFloat(value)
        this.setState({ message: null })
        this.props.handleChange(this.props.name, numberValue)
    }

    render() {
        const { name, params, id, value } = this.props
        const newId = id || name
        const [minValue, maxValue, stepValue] = params

        return (
            <div className="cell">
                <label htmlFor={newId} className="label">
                    {name}
                </label>
                <input
                    type="number"
                    id={id}
                    ref={this.myRef}
                    value={value}
                    onChange={e => this.handleChange(e.target.value)}
                    min={minValue}
                    max={maxValue}
                    step={stepValue}
                    style={{ margin: 0 }}
                />
                <label className="label red" style={{ opacity: 1 }}>
                    {this.state.message || " "}
                </label>
            </div>
        )
    }
}

export default InputField
