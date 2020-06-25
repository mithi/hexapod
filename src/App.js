import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import ReactGA from "react-ga"
import { VirtualHexapod, getNewPlotParams } from "./hexapod"
import * as defaults from "./templates"
import { SECTION_NAMES, PATHS } from "./components/vars"
import {
    PoseTable,
    Nav,
    NavDetailed,
    HexapodPlot,
    DimensionsWidget,
    AlertBox,
} from "./components"
import {
    ForwardKinematicsPage,
    InverseKinematicsPage,
    LandingPage,
    LegPatternPage,
} from "./components/pages"

ReactGA.initialize("UA-170794768-1", {
    //debug: true,
    //testMode: process.env.NODE_ENV === 'test',
    gaOptions: { siteSpeedSampleRate: 100 },
})

class App extends React.Component {
    state = {
        currentPage: SECTION_NAMES.LandingPage,
        inHexapodPage: false,
        showPoseMessage: true,
        showInfo: false,
        info: {},

        ikParams: defaults.DEFAULT_IK_PARAMS,
        patternParams: defaults.DEFAULT_PATTERN_PARAMS,

        hexapodParams: {
            dimensions: defaults.DEFAULT_DIMENSIONS,
            pose: defaults.DEFAULT_POSE,
        },

        plot: {
            data: defaults.DATA,
            layout: defaults.LAYOUT,
            latestCameraView: defaults.CAMERA_VIEW,
            revisionCounter: 0,
        },
    }

    /* * * * * * * * * * * * * *
     * Handle page load
     * * * * * * * * * * * * * */

    onPageLoad = pageName => {
        ReactGA.pageview(window.location.pathname + window.location.search)

        if (pageName === SECTION_NAMES.landingPage) {
            this.setState({
                currentPage: pageName,
                inHexapodPage: false,
                showInfo: false,
                showPoseMessage: false,
            })
            return
        }

        this.setState({
            currentPage: pageName,
            inHexapodPage: true,
            showInfo: false,
            showPoseMessage: false,
            ikParams: defaults.DEFAULT_IK_PARAMS,
            patternParams: defaults.DEFAULT_PATTERN_PARAMS,
            hexapodParams: { ...this.state.hexapodParams, pose: defaults.DEFAULT_POSE },
        })
        this.updatePlot(this.state.hexapodParams.dimensions, defaults.DEFAULT_POSE)
    }

    /* * * * * * * * * * * * * *
     * Handle plot update
     * * * * * * * * * * * * * */

    updatePlot = (dimensions, pose) => {
        const newHexapodModel = new VirtualHexapod(dimensions, pose)
        this.updatePlotWithHexapod(newHexapodModel)
    }

    updatePlotWithHexapod = hexapod => {
        if (hexapod === null || hexapod === undefined || !hexapod.foundSolution) {
            return
        }

        const [data, layout] = getNewPlotParams(hexapod, this.state.plot.latestCameraView)
        this.setState({
            plot: {
                ...this.state.plot,
                data,
                layout,
                revisionCounter: this.state.plot.revisionCounter + 1,
            },
            hexapodParams: {
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
        this.updatePlotWithHexapod(hexapod)
        this.setState({ ...updatedStateParams })
    }

    updateDimensions = dimensions =>
        this.updatePlot(dimensions, this.state.hexapodParams.pose)

    updatePose = pose => this.updatePlot(this.state.hexapodParams.dimensions, pose)

    updatePatternPose = (pose, patternParams) => {
        this.updatePlot(this.state.hexapodParams.dimensions, pose)
        this.setState({ patternParams })
    }

    /* * * * * * * * * * * * * *
     * Control display of widgets
     * * * * * * * * * * * * * */

    mightShowMessage = () =>
        this.state.showInfo ? <AlertBox info={this.state.info} /> : null

    mightShowDetailedNav = () => (this.state.inHexapodPage ? <NavDetailed /> : null)

    mightShowPoseTable = () => {
        if (this.state.showPoseMessage) {
            return <PoseTable pose={this.state.hexapodParams.pose} />
        }
    }

    mightShowDimensions = () => {
        if (this.state.inHexapodPage) {
            return (
                <DimensionsWidget
                    params={{ dimensions: this.state.hexapodParams.dimensions }}
                    onUpdate={this.updateDimensions}
                />
            )
        }
    }

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

    /* * * * * * * * * * * * * *
     * Pages
     * * * * * * * * * * * * * */

    showPage = () => (
        <Switch>
            <Route path="/" exact>
                <LandingPage onMount={this.onPageLoad} />
            </Route>
            <Route path={PATHS.forwardKinematics.path}>
                <ForwardKinematicsPage
                    params={{ pose: this.state.hexapodParams.pose }}
                    onUpdate={this.updatePose}
                    onMount={this.onPageLoad}
                />
            </Route>
            <Route path={PATHS.inverseKinematics.path}>
                <InverseKinematicsPage
                    params={{
                        dimensions: this.state.hexapodParams.dimensions,
                        ikParams: this.state.ikParams,
                    }}
                    onUpdate={this.updateIkParams}
                    onMount={this.onPageLoad}
                />
            </Route>
            <Route path={PATHS.legPatterns.path}>
                <LegPatternPage
                    params={{ patternParams: this.state.patternParams }}
                    onUpdate={this.updatePatternPose}
                    onMount={this.onPageLoad}
                />
            </Route>
        </Switch>
    )

    /* * * * * * * * * * * * * *
     * Layout
     * * * * * * * * * * * * * */

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
