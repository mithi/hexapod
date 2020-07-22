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

const Page = ({ pageComponent} ) => (
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
        this.manageState("pose", { pose: defaults.DEFAULT_POSE })

        gtag("config", "UA-170794768-1", {
            page_path: window.location.pathname + window.location.search,
        })

        document.title = pageName + " - Mithi's Bare Minimum Hexapod Robot Simulator"
    }

    //updateType, newParam, state => newState
    manageState = (updateType, newParam) => {
        let hexapod = null
        const { pose, dimensions } = this.state.hexapod

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
            return
        }

        this.setState({
            revision: this.state.revision + 1,
            hexapod,
        })
    }
    /* * * * * * * * * * * * * *
     * Pages
     * * * * * * * * * * * * * */

    pageComponent = Component => (
        <Component
            onMount={this.onPageLoad}
            onUpdate={this.manageState}
            params={{
                dimensions: this.state.hexapod.dimensions,
                pose: this.state.hexapod.pose,
            }}
        />
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
                            onUpdate={this.manageState}
                        />
                    </div>
                    <Page pageComponent={this.pageComponent} />
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
