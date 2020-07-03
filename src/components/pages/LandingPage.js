import React, { useLayoutEffect } from "react"
import { NavDetailed } from ".."
import { LANDING_PAGE_TITLE, LANDING_PAGE_SUBTITLE, SECTION_NAMES } from "../vars"

function LandingPage({ onMount }) {
    useLayoutEffect(() => {
        onMount(SECTION_NAMES.landingPage)
    }, [onMount])

    return (
        <>
            <div className="hexapod-img" />
            <div id="landing">
                <h1>{LANDING_PAGE_TITLE}</h1>
                <p>{LANDING_PAGE_SUBTITLE}</p>
            </div>
            <NavDetailed />
        </>
    )
}

export default LandingPage
