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
    state = {
        inHexapodPage: false,

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

        const { plot } = this.state
        const { dimensions, pose } = hexapod
        const [data, layout] = getNewPlotParams(hexapod, plot.latestCameraView)
        this.setState({
            plot: {
                ...plot,
                data,
                layout,
                revisionCounter: plot.revisionCounter + 1,
            },
            hexapodParams: { dimensions, pose },
        })
    }

    logCameraView = relayoutData => {
        const newCameraView = relayoutData["scene.camera"]
        const plot = { ...this.state.plot, latestCameraView: newCameraView }
        this.setState({ ...this.state, plot })
    }

    updatePlot = (dimensions, pose) => {
        const newHexapodModel = new VirtualHexapod(dimensions, pose)
        this.updatePlotWithHexapod(newHexapodModel)
    }

    updateDimensions = dimensions =>
        this.updatePlot(dimensions, this.state.hexapodParams.pose)

    updatePose = pose => this.updatePlot(this.state.hexapodParams.dimensions, pose)

    /* * * * * * * * * * * * * *
     * Widgets control
     * * * * * * * * * * * * * */

    plot = () => {
        const { data, layout, revisionCounter } = this.state.plot
        const props = {
            data,
            layout,
            revisionCounter,
            onRelayout: this.logCameraView,
        }

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
    pageComponent = (Component, onUpdate, params) => (
        <Component onMount={this.onPageLoad} onUpdate={onUpdate} params={params} />
    )

    pageLanding = () => this.pageComponent(LandingPage)

    pagePatterns = () => this.pageComponent(LegPatternPage, this.updatePose)

    pageIk = () =>
        this.pageComponent(InverseKinematicsPage, this.updatePlotWithHexapod, {
            dimensions: this.state.hexapodParams.dimensions,
        })

    pageFk = () =>
        this.pageComponent(ForwardKinematicsPage, this.updatePose, {
            pose: this.state.hexapodParams.pose,
        })

    pageWalking = () =>
        this.pageComponent(WalkingGaitsPage, this.updatePlotWithHexapod, {
            dimensions: this.state.hexapodParams.dimensions,
        })

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
                {this.plot()}
            </div>
            {this.navDetailed()}
        </Router>
    )
}

export default App
