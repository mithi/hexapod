import React, { Component } from "react"
import { sliderList, Card } from "../generic"

class LegPatternPage extends Component {
    pageName = "Leg Patterns"

    componentDidMount() {
        this.props.onMount(this.pageName)
    }

    rotateSliders = () =>
        sliderList(["alpha", "beta", "gamma"], [-180, 180, 1], this.props)

    render = () => (
        <Card title={this.pageName} h="h2">
            <div className="row-container">{this.rotateSliders()}</div>
        </Card>
    )
}

export default LegPatternPage
