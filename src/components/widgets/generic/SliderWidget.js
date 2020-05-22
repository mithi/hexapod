import React from "react"

const Slider = props => (
    <div className="slider-container cell">
        <label htmlFor={props.name} className="label">
            {props.name}: {props.value}
        </label>
        <input
            type="range"
            min={props.params[0]}
            max={props.params[1]}
            step={props.params[2]}
            value={props.value}
            onChange={e => props.handleChange(props.name, e.target.value)}
            className="slider"
        />
    </div>
)

const sliderList = (sliderNames, params, props) =>
    sliderNames.map(name => (
        <Slider
            key={name}
            name={name}
            params={params}
            handleChange={props.onUpdate}
            value={props.params[name]}
        />
    ))

export { Slider, sliderList }
