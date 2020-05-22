import React from "react"

const InputField = props => {
    const [minVal, maxVal, stepVal] = props.params

    return (
        <div className="cell">
            <label htmlFor={props.name} className="label">
                {props.name}
            </label>
            <input
                type="number"
                id={props.name}
                value={props.value}
                onChange={e => props.handleChange(props.name, e.target.value)}
                min={minVal}
                max={maxVal}
                step={stepVal}
            />
        </div>
    )
}

export default InputField