import React from "react"
import { Route, Switch, useRouteMatch } from "react-router-dom"
import { HEXAPOD_LINK_PATHS, PATHS } from "./components/vars"

import { PoseTable, NavDetailed, DimensionsWidget, AlertBox } from "./components"

import {
    SuspenseLandingPage,
    SuspenseForwardKinematicsPage,
    SuspenseInverseKinematicsPage,
    SuspenseLegPatternPage,
    SuspenseHexapodPlot,
} from "./loadables"

export const Routes = ({
    onPageLoad,
    showPoseMessage,
    showInfo,
    info,
    data,
    layout,
    revision,
    hexapodParams,
    patternParams,
    ikParams,
    updatePose,
    updateIkParams,
    updatePatternPose,
    updateDimensions,
    onRelayout,
}) => {
    const { path } = useRouteMatch()
    return (
        <>
            <div className="main content">
                <div className="sidebar column-container cell">
                    <Route path={HEXAPOD_LINK_PATHS} exact>
                        <DimensionsWidget
                            params={{
                                dimensions: hexapodParams.dimensions,
                            }}
                            onUpdate={updateDimensions}
                        />
                    </Route>
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
                    <PoseTable
                        pose={hexapodParams.pose}
                        showPoseTable={showPoseMessage}
                    />
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
