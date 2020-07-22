import React, { Suspense } from "react"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import { VirtualHexapod } from "./hexapod"
import * as defaults from "./templates"
import { SECTION_NAMES, PATHS } from "./components/vars"
import { Nav, NavDetailed, DimensionsWidget } from "./components"
import {
    InverseKinematicsPage,
    WalkingGaitsPage,
    ForwardKinematicsPage,
    LegPatternPage,
    LandingPage,
} from "./components/pages"

const HexapodPlot = React.lazy(() =>
    import(/* webpackPrefetch: true */ "./components/HexapodPlot")
)

const RandomRobotGif = React.lazy(() =>
    import(/* webpackPrefetch: true */ "./components/pages/RandomRobotGif")
)

window.dataLayer = window.dataLayer || []
function gtag() {
    window.dataLayer.push(arguments)
}

class App extends React.Component {
    state = {
        inHexapodPage: false,
        hexapod: new VirtualHexapod(defaults.DEFAULT_DIMENSIONS, defaults.DEFAULT_POSE),
        revision: 0,
    }

    /* * * * * * * * * * * * * *
     * Page load and plot update handlers
     * * * * * * * * * * * * * */

    onPageLoad = pageName => {
        if (pageName === SECTION_NAMES.landingPage) {
            this.setState({ inHexapodPage: false })
            return
        }

        this.setState({ inHexapodPage: true })
        this.updatePlot(this.state.hexapod.dimensions, defaults.DEFAULT_POSE)

        gtag("config", "UA-170794768-1", {
            page_path: window.location.pathname + window.location.search,
        })

        document.title = pageName + " - Mithi's Bare Minimum Hexapod Robot Simulator"
    }

    updatePlotWithHexapod = hexapod => {
        if (!hexapod || !hexapod.foundSolution) {
            return
        }
        this.setState({
            revision: this.state.revision + 1,
            hexapod,
        })
    }

    updatePlot = (dimensions, pose) => {
        const newHexapodModel = new VirtualHexapod(dimensions, pose)
        this.updatePlotWithHexapod(newHexapodModel)
    }

    updateDimensions = dimensions => this.updatePlot(dimensions, this.state.hexapod.pose)

    updatePose = pose => this.updatePlot(this.state.hexapod.dimensions, pose)

    /* * * * * * * * * * * * * *
     * Pages
     * * * * * * * * * * * * * */
    get hexapodParams() {
        return {
            dimensions: this.state.hexapod.dimensions,
            pose: this.state.hexapod.pose,
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
            pose: this.state.hexapod.pose,
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

    hexapodPage = () => (
        <div id="main">
            <div id="sidebar">
                <DimensionsWidget
                    params={{ dimensions: this.state.hexapod.dimensions }}
                    onUpdate={this.updateDimensions}
                />
                {this.page()}
            </div>
            <div id="plot" className="border">
                <HexapodPlot
                    revision={this.state.revision}
                    hexapod={this.state.hexapod}
                />
            </div>
        </div>
    )

    /* * * * * * * * * * * * * *
     * Layout
     * * * * * * * * * * * * * */

    render = () => (
        <Router>
            <Nav />
            <Suspense fallback={<p>Loading page... </p>}>{this.hexapodPage()}</Suspense>
            <Suspense fallback={<p>Cute robot will be displayed here</p>}>
            <RandomRobotGif />
            </Suspense>
            <NavDetailed />
        </Router>
    )
}

export default App
