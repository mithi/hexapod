import React from "react"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import ReactGA from "react-ga"
import { VirtualHexapod, getNewPlotParams } from "./hexapod"
import * as defaults from "./templates"
import { PATH_LINKS } from "./components/vars"
import { Nav } from "./components"

import Routes from "./routes"
import { HandlersProvider } from "./components/providers/Handlers"
import { HexapodParamsProvider } from "./components/providers/HexapodParams"

ReactGA.initialize("UA-170794768-1", {
    //debug: true,
    //testMode: process.env.NODE_ENV === 'test',
    gaOptions: { siteSpeedSampleRate: 100 },
})

class App extends React.Component {
    state = {
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

    onPageLoad = () => {
        ReactGA.pageview(window.location.pathname + window.location.search)

        this.setState(
            {
                hexapodParams: {
                    ...this.state.hexapodParams,
                    pose: defaults.DEFAULT_POSE,
                },
            },
            () =>
                this.updatePlot(
                    this.state.hexapodParams.dimensions,
                    defaults.DEFAULT_POSE
                )
        )
    }

    /* * * * * * * * * * * * * *
     * Handle plot update
     * * * * * * * * * * * * * */

    updatePlotWithHexapod = hexapod => {
        if (hexapod === null || hexapod === undefined || !hexapod.foundSolution) {
            return
        }

        const [data, layout] = getNewPlotParams(hexapod, this.state.plot.latestCameraView)
        return this.setState({
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
        return this.setState({ ...this.state, plot: plot })
    }

    updatePlot = (dimensions, pose) => {
        const newHexapodModel = new VirtualHexapod(dimensions, pose)
        this.updatePlotWithHexapod(newHexapodModel)
    }

    updateDimensions = dimensions =>
        this.updatePlot(dimensions, this.state.hexapodParams.pose)

    updatePose = pose => this.updatePlot(this.state.hexapodParams.dimensions, pose)

    /* * * * * * * * * * * * * *
     * Layout
     * * * * * * * * * * * * * */

    render() {
        return (
            <Router>
                <Nav />
                <Switch>
                    <Route path={PATH_LINKS.map(({ path }) => path)} exact>
                        <HexapodParamsProvider {...this.state.hexapodParams}>
                            <HandlersProvider
                                onPageLoad={this.onPageLoad}
                                updatePose={this.updatePose}
                                updatePlotWithHexapod={this.updatePlotWithHexapod}
                                updateDimensions={this.updateDimensions}
                            >
                                <Routes
                                    {...this.state.plot}
                                    onRelayout={this.logCameraView}
                                />
                            </HandlersProvider>
                        </HexapodParamsProvider>
                    </Route>
                    <Route>
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </Router>
        )
    }
}

export default App
