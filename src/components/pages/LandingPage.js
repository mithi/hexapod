import React from "react"
import { SECTION_NAMES } from "../vars"
import RandomRobotGif from "./RandomRobotGif"

class LandingPage extends React.Component {
    pageName = SECTION_NAMES.landingPage

    componentDidMount = () => this.props.onMount(this.pageName)

    render = () => (
        <>
            <div id="landing">
                <RandomRobotGif />
                <h1>Mithi's Bare Minimum Hexapod Robot Simulator</h1>
                <p>
                    This page may <span className="red">feel slow</span> because it is
                    also eagerly loading and mounting the 3d plot (behind the scenes) so
                    you don't have to wait for it later.. You can actually already
                    navigate to any of the links below (which I recommend) right now, even
                    if this page hasn't fully loaded yet. Enjoy your stay and share with
                    your friends!
                </p>
            </div>
        </>
    )
}

export default LandingPage
