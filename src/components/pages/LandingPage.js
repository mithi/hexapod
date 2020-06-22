import React from "react"
import ReactMarkdown from "react-markdown"
import { NavDetailed } from ".."
import { PageLink } from "../generic"
import { LANDING_PAGE_MESSAGE, SECTION_NAMES, PATHS } from "../texts"

class LandingPage extends React.Component {
    pageName = SECTION_NAMES.landingPage

    componentDidMount() {
        this.props.onMount(this.pageName)
    }

    render = () => (
        <>
            <PageLink path={PATHS.inverseKinematics.path}>
                <div className="hexapod-img" />{" "}
            </PageLink>
            <div id="landing">
                <ReactMarkdown source={LANDING_PAGE_MESSAGE} />
            </div>
            <NavDetailed />
        </>
    )
}

export default LandingPage
