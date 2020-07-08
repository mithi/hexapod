import React, { useLayoutEffect } from "react"
import { NavDetailed } from ".."
import { LANDING_PAGE_TITLE, LANDING_PAGE_SUBTITLE } from "../vars"
import { usePageLoad } from "../providers/Handlers"

function LandingPage() {
    const onPageLoad = usePageLoad()

    useLayoutEffect(() => {
        onPageLoad()
    }, [onPageLoad])

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
