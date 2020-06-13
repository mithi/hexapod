import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { VirtualHexapod, getNewPlotParams } from "./hexapod"
import {
    DEFAULT_DIMENSIONS,
    DEFAULT_POSE,
    DEFAULT_IK_PARAMS,
    DATA,
    LAYOUT,
    CAMERA_VIEW,
} from "./templates"
import {
    PoseTable,
    Nav,
    NavDetailed,
    HexapodPlot,
    DimensionsWidget,
    MessageBox,
} from "./components"

import {
    ForwardKinematicsPage,
    InverseKinematicsPage,
    LandingPage,
    LegPatternPage,
} from "./components/pages"

class App extends React.Component {
    state = {
        currentPage: "Root",
        inHexapodPage: false,
        showPoseMessage: true,
        showInfo: false,
        info: {},
        ikParams: DEFAULT_IK_PARAMS,
        patternParams: { alpha: 0, beta: 0, gamma: 0 },
        hexapod: {
            dimensions: DEFAULT_DIMENSIONS,
            pose: DEFAULT_POSE,
            points: {},
        },
        plot: {
            data: DATA,
            layout: LAYOUT,
            latestCameraView: CAMERA_VIEW,
            revisionCounter: 0,
        },
    }

    onPageLoad = pageName => {
        if (pageName === "Root") {
            this.setState({
                inHexapodPage: false,
                currentPage: pageName,
                showInfo: false,
            })
            return
        }

        this.setState({ showInfo: false })

        this.setState({
            inHexapodPage: true,
            currentPage: pageName,
            ikParams: DEFAULT_IK_PARAMS,
            hexapod: { ...this.state.hexapod, pose: DEFAULT_POSE },
            patternParams: { alpha: 0, beta: 0, gamma: 0 },
        })
        this.updatePlot(this.state.hexapod.dimensions, DEFAULT_POSE)
    }

    /* * * * * * * * * * * * * *
     * Handle plot update
     * * * * * * * * * * * * * */

    updatePlot = (dimensions, pose) => {
        const newHexapodModel = new VirtualHexapod(dimensions, pose)
        this.updatePlotWithHexapod(newHexapodModel)
    }

    updatePlotWithHexapod = hexapod => {
        const [data, layout] = getNewPlotParams(hexapod, this.state.plot.latestCameraView)
        this.setState({
            plot: {
                ...this.state.plot,
                data,
                layout,
                revisionCounter: this.state.plot.revisionCounter + 1,
            },
            hexapod: {
                ...this.state.hexapod,
                dimensions: hexapod.dimensions,
                pose: hexapod.pose,
            },
        })
    }

    logCameraView = relayoutData => {
        const newCameraView = relayoutData["scene.camera"]
        const plot = { ...this.state.plot, latestCameraView: newCameraView }
        this.setState({ ...this.state, plot: plot })
    }

    /* * * * * * * * * * * * * *
     * Handle individual input fields update
     * * * * * * * * * * * * * */

    updateIkParams = (hexapod, updatedStateParams) => {
        if (hexapod !== null) {
            this.updatePlotWithHexapod(hexapod)
        }
        this.setState({ ...updatedStateParams })
    }

    updateDimensions = dimensions => this.updatePlot(dimensions, this.state.hexapod.pose)

    updatePose = pose => this.updatePlot(this.state.hexapod.dimensions, pose)

    updatePatternPose = (pose, patternParams) => {
        this.updatePlot(this.state.hexapod.dimensions, pose)
        this.setState({ patternParams })
    }

    /* * * * * * * * * * * * * *
     * Control display of widgets
     * * * * * * * * * * * * * */
    mightShowMessage = () =>
        this.state.showInfo ? <MessageBox info={this.state.info} /> : null

    mightShowDetailedNav = () => (this.state.inHexapodPage ? <NavDetailed /> : null)

    mightShowPoseTable = () => {
        if (this.state.showPoseMessage) {
            return <PoseTable pose={this.state.hexapod.pose} />
        }
    }

    mightShowDimensions = () =>
        this.state.inHexapodPage ? (
            <DimensionsWidget
                dimensions={this.state.hexapod.dimensions}
                onUpdate={this.updateDimensions}
                onReset={this.reset}
            />
        ) : null

    mightShowPlot = () => (
        <div className={this.state.inHexapodPage ? "plot border" : "no-display"}>
            <HexapodPlot
                data={this.state.plot.data}
                layout={this.state.plot.layout}
                onRelayout={this.logCameraView}
                revision={this.state.plot.revisionCounter}
            />
        </div>
    )

    showPage = () => (
        <Switch>
            <Route path="/" exact>
                <LandingPage onMount={this.onPageLoad} />
            </Route>
            <Route path="/forward-kinematics">
                <ForwardKinematicsPage
                    params={this.state.hexapod.pose}
                    onUpdate={this.updatePose}
                    onMount={this.onPageLoad}
                />
            </Route>
            <Route path="/inverse-kinematics">
                <InverseKinematicsPage
                    params={{
                        dimensions: this.state.hexapod.dimensions,
                        ikParams: this.state.ikParams,
                    }}
                    onUpdate={this.updateIkParams}
                    onMount={this.onPageLoad}
                />
            </Route>
            <Route path="/leg-patterns">
                <LegPatternPage
                    params={this.state.patternParams}
                    onUpdate={this.updatePatternPose}
                    onMount={this.onPageLoad}
                />
            </Route>
        </Switch>
    )

    render = () => (
        <Router>
            <Nav />
            <div className="main content">
                <div className="sidebar column-container cell">
                    {this.mightShowDimensions()}
                    {this.showPage()}
                    {this.mightShowPoseTable()}
                    {this.mightShowMessage()}
                </div>
                {this.mightShowPlot()}
            </div>
            {this.mightShowDetailedNav()}
        </Router>
    )
}

export default App
