import React, { Component } from "react"
import { sliderList, Card } from "../generic"
import { DEFAULT_POSE } from "../../templates"

class LegPatternPage extends Component {
    pageName = "Leg Patterns"

    componentDidMount() {
        this.props.onMount(this.pageName)
    }

    updatePatternPose = (name, value) => {
        let newPose = {}

        for (const leg in DEFAULT_POSE) {
            newPose[leg] = { ...DEFAULT_POSE[leg], [name]: Number(value) }
        }

        const patternParams = { ...this.props.params.patternParams, [name]: value }
        this.props.onUpdate(newPose, patternParams)
    }

    rotateSliders = () =>
        sliderList(["alpha", "beta", "gamma"], [-180, 180, 1], {
            onUpdate: this.updatePatternPose,
            params: this.props.params.patternParams,
        })

    render = () => (
        <Card title={this.pageName} h="h2">
            <div className="row-container">{this.rotateSliders()}</div>
        </Card>
    )
}

export default LegPatternPage
