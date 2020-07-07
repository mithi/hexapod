import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import ReactGA from "react-ga"
import { VirtualHexapod, getNewPlotParams } from "./hexapod"
import * as defaults from "./templates"
import { SECTION_NAMES, PATH_LINKS } from "./components/vars"
import { Nav } from "./components"
import NoMatch from "./components/pages/NoMatch"

import Routes from "./routes"

ReactGA.initialize("UA-170794768-1", {
    //debug: true,
    //testMode: process.env.NODE_ENV === 'test',
    gaOptions: { siteSpeedSampleRate: 100 },
})

class App extends React.Component {
    state = {
        currentPage: SECTION_NAMES.LandingPage,
        showPoseMessage: false,
        showInfo: false,
        info: {},

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
        this.setState({ currentPage: pageName })

        if (pageName === SECTION_NAMES.landingPage) {
            this.setState({
                currentPage: pageName,
                showInfo: false,
                showPoseMessage: false,
            })
            return
        }

        this.setState({
            currentPage: pageName,
            showInfo: false,
            showPoseMessage: false,
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

    updateIk = (hexapod, updatedStateParams) => {
        this.updatePlotWithHexapod(hexapod)
        this.setState({ ...updatedStateParams })
    }

    updateDimensions = dimensions =>
        this.updatePlot(dimensions, this.state.hexapodParams.pose)

    updatePose = pose => this.updatePlot(this.state.hexapodParams.dimensions, pose)

    /* * * * * * * * * * * * * *
     * Layout
     * * * * * * * * * * * * * */

    render() {
        const { plot, ...rest } = this.state
        const routeProps = {
            ...rest,
            ...plot,
            revision: plot.revisionCounter,
            onRelayout: this.logCameraView,
            updatePose: this.updatePose,
            updateIkParams: this.updateIk,
            updatePatternPose: this.updatePose,
            updateDimensions: this.updateDimensions,
        }
        return (
            <Router>
                <Nav />
                <Switch>
                    <Route path={PATH_LINKS.map(({ path }) => path)} exact>
                        <Routes {...routeProps} onPageLoad={this.onPageLoad} />
                    </Route>
                    <Route>
                        <NoMatch />
                    </Route>
                </Switch>
            </Router>
        )
    }
}

export default App
