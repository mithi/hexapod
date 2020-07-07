import React, { Component } from "react"
import { Card } from "../generic"

import { SECTION_NAMES } from "../vars"

class WalkingGaitsPage extends Component {
    pageName = SECTION_NAMES.walkingGaits

    componentDidMount() {
        this.props.onMount(this.pageName)
    }

    render = () => (
        <Card title={this.pageName} h="h2">
            <p>Hello World</p>
        </Card>
    )
}

export default WalkingGaitsPage
