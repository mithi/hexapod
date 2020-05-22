import React, { Component } from "react"
import Slider from "./generic/SliderWidget"

class LegPatternWidgets extends Component {
    componentDidMount() {
        this.props.onMount()
    }

    render() {
        const rotateSliders = ["alpha", "beta", "gamma"].map(name => {
            return (
                <Slider
                    key={name}
                    name={name}
                    params={[-1, 1, 0.01]}
                    handleChange={this.props.onUpdate}
                    value={this.props.params[name]}
                />
            )
        })

        return (
            <div>
                <h2>leg patterns</h2>
                <div className="row-container">{rotateSliders}</div>
            </div>
        )
    }
}

export default LegPatternWidgets
