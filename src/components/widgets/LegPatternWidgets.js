import React, { Component } from "react"
import { sliderList } from "./generic/SliderWidget"

class LegPatternWidgets extends Component {
    componentDidMount() {
        this.props.onMount()
    }

    render() {
        const rotateSliders = sliderList(
            ["alpha", "beta", "gamma"],
            [-1, 1, 0.01],
            this.props
        )

        return (
            <div>
                <h2>leg patterns</h2>
                <div className="row-container">{rotateSliders}</div>
            </div>
        )
    }
}

export default LegPatternWidgets
