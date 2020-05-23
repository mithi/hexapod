import React, { Component } from "react"
import { sliderList } from "./generic/SliderWidget"
import { Card } from "./generic/SmallWidgets"

class LegPatternWidgets extends Component {
    componentDidMount() {
        this.props.onMount()
    }

    rotateSliders = () =>
        sliderList(["alpha", "beta", "gamma"], [-1, 1, 0.01], this.props)

    render = () => (
        <Card title="Leg Patterns" h="h2">
            <div className="row-container">{this.rotateSliders()}</div>
        </Card>
    )
}

export default LegPatternWidgets
