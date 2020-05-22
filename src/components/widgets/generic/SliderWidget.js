import React from "react"

const Slider = props => {
    const [minVal, maxVal, stepVal] = props.params

    return (
        <div className="slider-container cell">
            <label htmlFor={props.name} className="label">
                {props.name}: {props.value}
            </label>
            <input
                type="range"
                min={minVal}
                max={maxVal}
                step={stepVal}
                value={props.value}
                onChange={e => props.handleChange(props.name, e.target.value)}
                className="slider"
            />
        </div>
    )
}

export default Slider
