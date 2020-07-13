import React from "react"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import ReactGA from "react-ga"
import { VirtualHexapod, getNewPlotParams } from "./hexapod"
import * as defaults from "./templates"
import { SECTION_NAMES, PATHS } from "./components/vars"
import { Nav, NavDetailed, HexapodPlot, DimensionsWidget } from "./components"
import {
    ForwardKinematicsPage,
    InverseKinematicsPage,
    LandingPage,
    LegPatternPage,
    WalkingGaitsPage,
} from "./components/pages"

ReactGA.initialize("UA-170794768-1", {
    //debug: true,
    //testMode: process.env.NODE_ENV === 'test',
    gaOptions: { siteSpeedSampleRate: 100 },
})

class App extends React.Component {
    plot = {
        cameraView: defaults.CAMERA_VIEW,
        data: defaults.DATA,
        layout: defaults.LAYOUT,
    }

    state = {
        inHexapodPage: false,

        hexapodParams: {
            dimensions: defaults.DEFAULT_DIMENSIONS,
            pose: defaults.DEFAULT_POSE,
        },

        revision: 0,
    }

    /* * * * * * * * * * * * * *
     * Page load and plot update handlers
     * * * * * * * * * * * * * */

    onPageLoad = pageName => {
        ReactGA.pageview(window.location.pathname + window.location.search)

        if (pageName === SECTION_NAMES.landingPage) {
            this.setState({ inHexapodPage: false })
            return
        }

        this.setState({ inHexapodPage: true })
        this.updatePlot(this.state.hexapodParams.dimensions, defaults.DEFAULT_POSE)
    }

    updatePlotWithHexapod = hexapod => {
        if (!hexapod || !hexapod.foundSolution) {
            return
        }

        const [data, layout] = getNewPlotParams(hexapod, this.plot.cameraView)
        this.plot = { ...this.plot, data, layout }

        const { dimensions, pose } = hexapod

        this.setState({
            revision: this.state.revision + 1,
            hexapodParams: { dimensions, pose },
        })
    }

    logCameraView = relayoutData => (this.plot.cameraView = relayoutData["scene.camera"])

    updatePlot = (dimensions, pose) => {
        const newHexapodModel = new VirtualHexapod(dimensions, pose)
        this.updatePlotWithHexapod(newHexapodModel)
    }

    updateDimensions = dimensions =>
        this.updatePlot(dimensions, this.state.hexapodParams.pose)

    updatePose = pose => this.updatePlot(this.state.hexapodParams.dimensions, pose)

    /* * * * * * * * * * * * * *
     * Widgets
     * * * * * * * * * * * * * */

    hexapodPlot = () => {
        const { revision } = this.state
        const { data, layout } = this.plot
        const props = { data, layout, revision, onRelayout: this.logCameraView }

        return (
            <div hidden={!this.state.inHexapodPage} className="plot border">
                <HexapodPlot {...props} />
            </div>
        )
    }

    dimensions = () => (
        <div hidden={!this.state.inHexapodPage}>
            <DimensionsWidget
                params={{ dimensions: this.state.hexapodParams.dimensions }}
                onUpdate={this.updateDimensions}
            />
        </div>
    )

    navDetailed = () => (
        <div hidden={!this.state.inHexapodPage}>
            <NavDetailed />
        </div>
    )

    /* * * * * * * * * * * * * *
     * Pages
     * * * * * * * * * * * * * */
    get hexapodParams() {
        return {
            dimensions: this.state.hexapodParams.dimensions,
            pose: this.state.hexapodParams.pose,
        }
    }

    pageComponent = (Component, onUpdate, params) => (
        <Component onMount={this.onPageLoad} onUpdate={onUpdate} params={params} />
    )

    pageLanding = () => this.pageComponent(LandingPage)

    pagePatterns = () => this.pageComponent(LegPatternPage, this.updatePose)

    pageIk = () =>
        this.pageComponent(
            InverseKinematicsPage,
            this.updatePlotWithHexapod,
            this.hexapodParams
        )

    pageFk = () =>
        this.pageComponent(ForwardKinematicsPage, this.updatePose, {
            pose: this.state.hexapodParams.pose,
        })

    pageWalking = () =>
        this.pageComponent(
            WalkingGaitsPage,
            this.updatePlotWithHexapod,
            this.hexapodParams
        )

    page = () => (
        <Switch>
            <Route path="/" exact component={this.pageLanding} />
            <Route path={PATHS.legPatterns.path} exact component={this.pagePatterns} />
            <Route path={PATHS.forwardKinematics.path} exact component={this.pageFk} />
            <Route path={PATHS.inverseKinematics.path} exact component={this.pageIk} />
            <Route path={PATHS.walkingGaits.path} exact component={this.pageWalking} />
            <Route>
                <Redirect to="/" />
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
                    {this.dimensions()}
                    {this.page()}
                </div>
                {this.hexapodPlot()}
            </div>
            {this.navDetailed()}
        </Router>
    )
}

export default App
