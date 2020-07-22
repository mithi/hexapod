import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import { PATHS } from "./components/vars"
import * as defaults from "./templates"
import { VirtualHexapod } from "./hexapod"
import {
    InverseKinematicsPage,
    WalkingGaitsPage,
    ForwardKinematicsPage,
    LegPatternPage,
    LandingPage,
} from "./components/pages"

const Page = ({ pageComponent }) => (
    <Switch>
        <Route path="/" exact>
            {pageComponent(LandingPage)}
        </Route>
        <Route path={PATHS.legPatterns.path} exact>
            {pageComponent(LegPatternPage)}
        </Route>
        <Route path={PATHS.forwardKinematics.path} exact>
            {pageComponent(ForwardKinematicsPage)}
        </Route>
        <Route path={PATHS.inverseKinematics.path} exact>
            {pageComponent(InverseKinematicsPage)}
        </Route>
        <Route path={PATHS.walkingGaits.path} exact>
            {pageComponent(WalkingGaitsPage)}
        </Route>
        <Route>
            <Redirect to="/" />
        </Route>
    </Switch>
)

const updateHexapod = (updateType, newParam, oldHexapod) => {
    if (updateType === "default") {
        return new VirtualHexapod(defaults.DEFAULT_DIMENSIONS, defaults.DEFAULT_POSE)
    }

    let hexapod = null
    const { pose, dimensions } = oldHexapod

    if (updateType === "pose") {
        hexapod = new VirtualHexapod(dimensions, newParam.pose)
    }

    if (updateType === "dimensions") {
        hexapod = new VirtualHexapod(newParam.dimensions, pose)
    }

    if (updateType === "hexapod") {
        hexapod = newParam.hexapod
    }

    if (!hexapod || !hexapod.foundSolution) {
        return oldHexapod
    }

    return hexapod
}

export { Page, updateHexapod }
