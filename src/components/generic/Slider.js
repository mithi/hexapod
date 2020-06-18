import React from "react"

/* *
 *
 * ................
 * props of Slider component:
 * ................
 *   name: Label of the slider
 *   params: [minimum, maximum, step]
 *   value: current value (to be displayed)
 *   handleChange: callback to call when slider changes
 *
 * */
const Slider = ({ name, value, attributes, handleChange }) => (
    <div className="slider-container cell">
        <label htmlFor={name} className="label">
            {name}: {value}
        </label>
        <input
            type="range"
            min={attributes[0]}
            max={attributes[1]}
            step={attributes[2]}
            value={value}
            onChange={e => handleChange(name, e.target.value)}
            className="slider"
        />
    </div>
)

/* *
 *
 * ................
 * params of Slider list:
 * ................
 *
 *   sliderNames: List of strings
 *   sliderSettings: [minimum, maximum, step]
 *   props.params: map from sliderNames to value
 *   props.onUpdate: callback to call when slider changes
 *
 * */
const sliderList = (sliderNames, sliderSettings, { onUpdate, params }) =>
    sliderNames.map(name => (
        <Slider
            key={name}
            name={name}
            attributes={sliderSettings}
            handleChange={onUpdate}
            value={params[name]}
        />
    ))

export { Slider, sliderList }
