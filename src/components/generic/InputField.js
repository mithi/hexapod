import React from "react"

const InputField = ({ name, value, params, handleChange }) => (
    <div className="cell">
        <label htmlFor={name} className="label">
            {name}
        </label>
        <input
            type="number"
            id={name}
            value={Number(value)}
            onChange={e => handleChange(name, e.target.value)}
            min={params[0]}
            max={params[1]}
            step={params[2]}
        />
    </div>
)

export default InputField
