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
const Slider = ({ name, id, value, rangeParams, handleChange }) => (
    <div className="slider-container cell">
        <label htmlFor={id || name} className="label">
            {name}: {value}
        </label>
        <input
            type="range"
            id={id || name}
            min={rangeParams.minVal}
            max={rangeParams.maxVal}
            step={rangeParams.stepVal}
            value={value}
            onChange={e => handleChange(name, e.target.value)}
            className="slider"
        />
    </div>
)

export { Slider }
