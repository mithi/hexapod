import React from "react"

/* *
 *
 * ................
 * props of Slider component:
 * ................
 *   name: Label of the slider
 *   attributes: [minimum, maximum, step]
 *   value: current value (to be displayed)
 *   handleChange: callback to call when slider changes
 *
 * */
const Slider = ({ name, id, value, attributes, handleChange }) => (
    <div className="slider-container cell">
        <label htmlFor={id || name } className="label">
            {name}: {value}
        </label>
        <input
            type="range"
            id={id || name}
            min={attributes[0]}
            max={attributes[1]}
            step={attributes[2]}
            value={value}
            onChange={e => handleChange(name, e.target.value)}
            className="slider"
        />
    </div>
)

export { Slider }
