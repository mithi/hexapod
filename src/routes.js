import React from "react"
import { Route, Switch, useRouteMatch } from "react-router-dom"
import { HEXAPOD_LINK_PATHS, PATHS } from "./components/vars"

import { PoseTable, NavDetailed, DimensionsWidget, AlertBox } from "./components"

import {
    SuspenseLandingPage,
    SuspenseForwardKinematicsPage,
    SuspenseInverseKinematicsPage,
    SuspenseLegPatternPage,
    SuspenseWalkingGaitsPage,
    SuspenseHexapodPlot,
} from "./loadables"

export const Routes = ({
    showPoseMessage,
    showInfo,
    info,
    data,
    layout,
    revision,
    hexapodParams,
    patternParams,
    onRelayout,
}) => {
    const { path } = useRouteMatch()
    const { dimensions, pose } = hexapodParams
    return (
        <>
            <div className="main content">
                <div className="sidebar column-container cell">
                    <Route path={HEXAPOD_LINK_PATHS} exact>
                        <DimensionsWidget params={{ dimensions }} />
                    </Route>
                    <Switch>
                        <Route path="/" exact>
                            <SuspenseLandingPage />
                        </Route>

                        <Route path={PATHS.forwardKinematics.path}>
                            <SuspenseForwardKinematicsPage params={{ pose }} />
                        </Route>

                        <Route path={PATHS.inverseKinematics.path}>
                            <SuspenseInverseKinematicsPage params={{ dimensions }} />
                        </Route>

                        <Route path={PATHS.legPatterns.path}>
                            <SuspenseLegPatternPage params={{ patternParams }} />
                        </Route>

                        <Route path={PATHS.walkingGaits.path}>
                            <SuspenseWalkingGaitsPage params={{ dimensions }} />
                        </Route>
                    </Switch>
                    <PoseTable pose={pose} showPoseTable={showPoseMessage} />
                    <AlertBox showInfo={showInfo} info={info} />
                </div>
                <div hidden={path === "/"} className="plot border">
                    <SuspenseHexapodPlot
                        data={data}
                        layout={layout}
                        onRelayout={onRelayout}
                        revision={revision}
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
