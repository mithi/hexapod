import React, { Component } from "react"
import { sliderList } from "../generic/SliderWidget"
import { Card } from "../generic/SmallWidgets"

class LegPatternPage extends Component {
    pageName = "Leg Patterns"

    componentDidMount() {
        this.props.onMount(this.pageName)
    }

    rotateSliders = () =>
        sliderList(["alpha", "beta", "gamma"], [-1, 1, 0.01], this.props)

    render = () => (
        <Card title={this.pageName} h="h2">
            <div className="row-container">{this.rotateSliders()}</div>
        </Card>
    )
}

export default LegPatternPage
