import React from "react"
import { SECTION_NAMES } from "../vars"
import { NavDetailed } from "../Nav"

const getImageUrl = () =>
    Math.random() > 0.5 ? "./img/small-robot-small.gif" : "./img/small-robot-2-small.gif"

class LandingPage extends React.Component {
    pageName = SECTION_NAMES.landingPage

    componentDidMount = () => this.props.onMount(this.pageName)

    render = () => (
        <>
            <div id="landing">
                <img
                    loading="lazy"
                    src={getImageUrl()}
                    alt="hexapod robot animation"
                    height="75"
                    style={{ marginTop: "20px", borderRadius: "20px" }}
                />
                <h1>Mithi's Bare Minimum Hexapod Robot Simulator</h1>
                <p>Enjoy your stay and share with your friends!</p>

                <NavDetailed />
            </div>
        </>
    )
}

export default LandingPage
