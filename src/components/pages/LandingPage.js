import React, { Suspense } from "react"
import { SECTION_NAMES } from "../vars"

const RandomRobotGif = React.lazy(() => import("./RandomRobotGif"))

class LandingPage extends React.Component {
    pageName = SECTION_NAMES.landingPage

    componentDidMount = () => this.props.onMount(this.pageName)

    render = () => (
        <>
            <div id="landing">
                <Suspense fallback={<p>A cute random robot will soon appear!</p>}>
                    <RandomRobotGif />
                </Suspense>
                <h1>Mithi's Bare Minimum Hexapod Robot Simulator</h1>
                <p>
                    This page may <span className="red">feel slow</span> because it is
                    also eagerly loading the 3d plot (behind the scenes) for a smoother
                    experience later.
                    <span className="red"> Actually</span>, you can already navigate to
                    any of the links below (which I recommend)
                    <span className="red"> right now</span>, even if the page hasn't fully
                    loaded yet. Enjoy your stay and share with your friends!
                </p>
            </div>
        </>
    )
}

export default LandingPage
