import React from "react"
import { SECTION_NAMES } from "../vars"
import RandomRobotGif from "../pagePartials/RandomRobotGif"

class LandingPage extends React.Component {
    pageName = SECTION_NAMES.landingPage

    componentDidMount = () => this.props.onMount(this.pageName)

    render = () => (
        <>
            <div id="landing">
                <RandomRobotGif />
                <h1>Mithi's Bare Minimum Hexapod Robot Simulator</h1>
                <p>
                    This page might feel slow at first, because it is also eagerly loading
                    and mounting the 3d plot behind the scenes! You can actually already
                    navigate to any of the links below right now (which I recommend), even
                    if this page hasn't fully loaded yet.
                </p>
                <p>
                    This app works offline! Enjoy your stay and share with your friends!
                </p>
            </div>
        </>
    )
}

export default LandingPage
