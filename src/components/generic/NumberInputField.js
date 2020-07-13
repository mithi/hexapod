import React, { Component } from "react"

class InputField extends Component {
    state = { message: null }

    constructor(props) {
        super(props)
        this.myRef = React.createRef()
    }

    componentDidMount() {
        this.setState({ message: null })
    }

    handleChange(value) {
        const { minVal, maxVal, stepVal } = this.props.rangeParams
        const validity = this.myRef.current.validity

        if (validity.badInput) {
            this.setState({ message: "NaN" })
            return
        }

        if (validity.rangeOverflow) {
            this.setState({ message: `max=${maxVal}` })
            return
        }

        if (validity.rangeUnderflow) {
            this.setState({ message: `min=${minVal}` })
            return
        }

        if (validity.stepMismatch) {
            this.setState({ message: `step=${stepVal}` })
            return
        }

        if (!this.myRef.current.checkValidity()) {
            this.setState({ message: "Error" })
            return
        }

        const numberValue = parseFloat(value)

        if (isNaN(numberValue)) {
            this.setState({ message: "NaN" })
            return
        }

        this.setState({ message: null })
        this.props.handleChange(this.props.name, numberValue)
    }

    render() {
        const { name, rangeParams, id, value } = this.props
        const newId = id || name
        const { minVal, maxVal, stepVal } = rangeParams
        const props = {
            type: "number",
            input: "numeric",
            id: newId,
            ref: this.myRef,
            value,
            min: minVal,
            max: maxVal,
            step: stepVal,
            style: { margin: 0 },
        }

        return (
            <div>
                <label htmlFor={newId} className="label">
                    {name}
                </label>
                <input {...props} onChange={e => this.handleChange(e.target.value)} />
                <label className="label red" style={{ opacity: 1 }}>
                    {this.state.message}
                </label>
            </div>
        )
    }
}

export default InputField
