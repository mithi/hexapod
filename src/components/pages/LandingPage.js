import React from "react"
import ReactMarkdown from "react-markdown"
import { NavDetailed } from ".."
import { LANDING_PAGE_MESSAGE, SECTION_NAMES } from "../vars"

class LandingPage extends React.Component {
    pageName = SECTION_NAMES.landingPage

    componentDidMount() {
        this.props.onMount(this.pageName)
    }

    render = () => (
        <>
            <div className="hexapod-img" />{" "}
            <div id="landing">
                <ReactMarkdown source={LANDING_PAGE_MESSAGE} />
            </div>
            <NavDetailed />
        </>
    )
}

export default LandingPage
