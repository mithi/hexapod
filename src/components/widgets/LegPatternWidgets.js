import React, { Component } from "react"
import { sliderList } from "./generic/SliderWidget"

class LegPatternWidgets extends Component {
    componentDidMount() {
        this.props.onMount()
    }

    rotateSliders = () =>
        sliderList(["alpha", "beta", "gamma"], [-1, 1, 0.01], this.props)

    render = () => (
        <>
            <h2>leg patterns</h2>
            <div className="row-container">{this.rotateSliders()}</div>
        </>
    )
}

export default LegPatternWidgets
