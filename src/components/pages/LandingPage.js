import React, { Suspense } from "react"
import { SECTION_NAMES } from "../vars"
import { NavDetailed } from "../Nav"

const RandomRobotGif = React.lazy(() => import("./RandomRobotGif"))

class LandingPage extends React.Component {
    pageName = SECTION_NAMES.landingPage

    componentDidMount = () => this.props.onMount(this.pageName)

    render = () => (
        <>
            <div id="landing">
                <Suspense fallback={<p>A cute random robot will be displayed here...</p>}>
                    <RandomRobotGif />
                </Suspense>
                <h1>Mithi's Bare Minimum Hexapod Robot Simulator</h1>
                <p>Enjoy your stay and share with your friends!</p>
                <NavDetailed />
            </div>
        </>
    )
}

export default LandingPage
