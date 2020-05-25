import React from "react"

const InputField = props => (
    <div className="cell">
        <label htmlFor={props.name} className="label">
            {props.name}
        </label>
        <input
            type="number"
            id={props.name}
            value={Number(props.value)}
            onChange={e => props.handleChange(props.name, e.target.value)}
            min={props.params[0]}
            max={props.params[1]}
            step={props.params[2]}
        />
    </div>
)

export default InputField
