import React from "react"
import { Route, Switch } from "react-router-dom"
import { PATHS } from "./components/vars"

import {
    SuspenseLandingPage,
    SuspenseForwardKinematicsPage,
    SuspenseInverseKinematicsPage,
    SuspenseLegPatternPage,
} from "./loadables"

export const Routes = ({
    onPageLoad,
    hexapodParams,
    ikParams,
    patternParams,
    updatePose,
    updateIkParams,
    updatePatternPose,
}) => (
    <Switch>
        <Route path="/" exact>
            <SuspenseLandingPage onMount={onPageLoad} />
        </Route>
        <Route path={PATHS.forwardKinematics.path}>
            <SuspenseForwardKinematicsPage
                params={{ pose: hexapodParams.pose }}
                onUpdate={updatePose}
                onMount={onPageLoad}
            />
        </Route>
        <Route path={PATHS.inverseKinematics.path}>
            <SuspenseInverseKinematicsPage
                params={{
                    dimensions: hexapodParams.dimensions,
                    ikParams: ikParams,
                }}
                onUpdate={updateIkParams}
                onMount={onPageLoad}
            />
        </Route>
        <Route path={PATHS.legPatterns.path}>
            <SuspenseLegPatternPage
                params={{ patternParams: patternParams }}
                onUpdate={updatePatternPose}
                onMount={onPageLoad}
            />
        </Route>
    </Switch>
)

export default Routes
