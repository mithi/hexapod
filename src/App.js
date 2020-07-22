import React, { Suspense } from "react"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import { VirtualHexapod } from "./hexapod"
import * as defaults from "./templates"
import { SECTION_NAMES, PATHS } from "./components/vars"
import { Nav, NavDetailed, DimensionsWidget } from "./components"
import { InverseKinematicsPage, WalkingGaitsPage, ForwardKinematicsPage, LegPatternPage, LandingPage } from "./components/pages"

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
        hexapod: new VirtualHexapod(defaults.DEFAULT_DIMENSIONS, defaults.DEFAULT_POSE ),
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
            hexapod
        })
    }

    updatePlot = (dimensions, pose) => {
        const newHexapodModel = new VirtualHexapod(dimensions, pose)
        this.updatePlotWithHexapod(newHexapodModel)
    }

    updateDimensions = dimensions => this.updatePlot(dimensions, this.state.hexapod.pose)

    updatePose = pose => this.updatePlot(this.state.hexapod.dimensions, pose)

    /* * * * * * * * * * * * * *
     * Widgets
     * * * * * * * * * * * * * */

    hexapodPlot = () => {
        const props = {
            revision: this.state.revision,
            hexapod: this.state.hexapod
        }

        return (
            <div className="plot border">
                <Suspense fallback={<h1>Loading 3d plot...</h1>}>
                    <HexapodPlot {...props} />
                </Suspense>
            </div>
        )
    }

    dimensions = () => (
        <div hidden={!this.state.inHexapodPage}>
            <DimensionsWidget
                params={{ dimensions: this.state.hexapod.dimensions }}
                onUpdate={this.updateDimensions}
            />
        </div>
    )

    /* * * * * * * * * * * * * *
     * Pages
     * * * * * * * * * * * * * */
    get hexapodParams() {
        return {
            dimensions: this.state.hexapod.dimensions,
            pose: this.state.hexapod.pose,
        }
    }

    pageComponent = (Component, onUpdate, params) =>
        <Component onMount={this.onPageLoad} onUpdate={onUpdate} params={params} />


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
                {this.state.inHexapodPage ? this.hexapodPlot() : null}
            </div>
            {this.state.inHexapodPage ? <NavDetailed /> : null}
        </Router>
    )
}

export default App
