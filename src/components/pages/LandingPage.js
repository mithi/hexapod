import React from "react"
import { SECTION_NAMES } from "../vars"

class LandingPage extends React.Component {
    pageName = SECTION_NAMES.landingPage

    componentDidMount = () => this.props.onMount(this.pageName)

    render = () => (
        <>
            <div id="landing">
                <h1>Mithi's Hexapod Robot Simulator</h1>
                <p>Enjoy your stay and share with your friends!</p>
            </div>
        </>
    )
}

export default LandingPage
