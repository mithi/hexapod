import React from "react"
import { Route, Switch, useRouteMatch } from "react-router-dom"
import { HEXAPOD_LINK_PATHS, PATHS } from "./components/vars"

import { NavDetailed, DimensionsWidget } from "./components"

import {
    SuspenseLandingPage,
    SuspenseForwardKinematicsPage,
    SuspenseInverseKinematicsPage,
    SuspenseLegPatternPage,
    SuspenseWalkingGaitsPage,
    SuspenseHexapodPlot,
} from "./loadables"

export const Routes = ({ data, layout, counter, onRelayout }) => {
    const { path } = useRouteMatch()

    return (
        <>
            <div className="main content">
                <div className="sidebar column-container cell">
                    <Route path={HEXAPOD_LINK_PATHS} exact>
                        <DimensionsWidget />
                    </Route>
                    <Switch>
                        <Route path="/" exact>
                            <SuspenseLandingPage />
                        </Route>

                        <Route path={PATHS.forwardKinematics.path}>
                            <SuspenseForwardKinematicsPage />
                        </Route>

                        <Route path={PATHS.inverseKinematics.path}>
                            <SuspenseInverseKinematicsPage />
                        </Route>

                        <Route path={PATHS.legPatterns.path}>
                            <SuspenseLegPatternPage />
                        </Route>

                        <Route path={PATHS.walkingGaits.path}>
                            <SuspenseWalkingGaitsPage />
                        </Route>
                    </Switch>
                </div>
                <div hidden={path === "/"} className="plot border">
                    <SuspenseHexapodPlot
                        data={data}
                        layout={layout}
                        onRelayout={onRelayout}
                        revision={counter}
                    />
                </div>
            </div>
            <Route path={HEXAPOD_LINK_PATHS} exact>
                <NavDetailed />
            </Route>
        </>
    )
}

export default Routes
