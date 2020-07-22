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

    pageComponent = (Component, onUpdate) => (
        <Component
            onMount={this.onPageLoad}
            onUpdate={onUpdate}
            params={{
                dimensions: this.state.hexapod.dimensions,
                pose: this.state.hexapod.pose,
            }}
        />
    )

    page = () => (
        <Switch>
            <Route path="/" exact>
                {this.pageComponent(LandingPage)}
            </Route>
            <Route path={PATHS.legPatterns.path} exact>
                {this.pageComponent(LegPatternPage, this.updatePose)}
            </Route>
            <Route path={PATHS.forwardKinematics.path} exact>
                {this.pageComponent(ForwardKinematicsPage, this.updatePose)}
            </Route>
            <Route path={PATHS.inverseKinematics.path} exact>
                {this.pageComponent(InverseKinematicsPage, this.updatePlotWithHexapod)}
            </Route>
            <Route path={PATHS.walkingGaits.path} exact>
                {this.pageComponent(WalkingGaitsPage, this.updatePlotWithHexapod)}
            </Route>
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
            <div id="main">
                <div id="sidebar">
                    <div hidden={!this.state.inHexapodPage}>
                        <DimensionsWidget
                            params={{ dimensions: this.state.hexapod.dimensions }}
                            onUpdate={this.updateDimensions}
                        />
                    </div>
                    {this.page()}
                </div>
                <Suspense fallback={<p>Preloading the plot for later... </p>}>
                    <div id="plot" className="border" hidden={!this.state.inHexapodPage}>
                        <HexapodPlot
                            revision={this.state.revision}
                            hexapod={this.state.hexapod}
                        />
                    </div>
                </Suspense>
            </div>
            <NavDetailed />
        </Router>
    )
}

export default App
