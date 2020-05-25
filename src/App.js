import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import { DATA, LAYOUT, CAMERA_VIEW } from "./templates/plotParams"
import { DIMENSIONS, POSE, IK_PARAMS } from "./templates/hexapodParams"

import { NavBar, NavFooter } from "./components/Nav"
import HexapodPlot from "./components/HexapodPlot"
import DimensionsWidget from "./components/DimensionsWidget"

import {
    ForwardKinematicsPage,
    InverseKinematicsPage,
    LandingPage,
    LegPatternPage,
} from "./components/pages"

import VirtualHexapod from "./hexapod/VirtualHexapod"
import getNewPlotParams from "./hexapod/plotter"

const splitDimensions = dimensions => {
    const bodyDimensions = {
        front: dimensions.front,
        middle: dimensions.middle,
        side: dimensions.side,
    }

    const legDimensions = {
        coxia: dimensions.coxia,
        femur: dimensions.femur,
        tibia: dimensions.tibia,
    }

    return [bodyDimensions, legDimensions]
}

class App extends React.Component {
    state = {
        currentPage: "Root",
        shouldDisplayDimensionsAndPlot: false,
        alerts: "",
        messages: "",
        ikParams: IK_PARAMS,
        patternParams: { alpha: 0, beta: 0, gamma: 0 },
        hexapod: {
            dimensions: DIMENSIONS,
            pose: POSE,
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
        pageName === "Root"
            ? this.setState({ shouldDisplayDimensionsAndPlot: false })
            : this.setState({ shouldDisplayDimensionsAndPlot: true })

        this.setState({ currentPage: pageName })
        this.setState({ ikParams: IK_PARAMS })
        this.setState({ hexapod: { ...this.state.hexapod, pose: POSE } })
        this.setState({
            patternParams: { alpha: 0, beta: 0, gamma: 0 },
        })
    }

    updatePlot = (dimensions, pose) => {
        const [bodyDimensions, legDimensions] = splitDimensions(dimensions)
        const newHexapodModel = new VirtualHexapod(
            bodyDimensions,
            legDimensions,
            pose
        )
        const [data, layout] = getNewPlotParams(
            newHexapodModel,
            this.state.plot.latestCameraView
        )
        this.setState({
            plot: {
                ...this.state.plot,
                data,
                layout,
                revisionCounter: this.state.plot.revisionCounter + 1,
            },
            hexapod: { ...this.state.hexapod, dimensions, pose },
        })
    }

    updateDimensions = (name, value) => {
        const dimensions = { ...this.state.hexapod.dimensions, [name]: value }
        this.updatePlot(dimensions, this.state.hexapod.pose)
    }

    updateIkParams = (name, value) => {
        this.setState({
            ikParams: { ...this.state.ikParams, [name]: value },
        })
    }

    updatePose = (name, angle, value) => {
        const { pose } = this.state.hexapod
        const newPose = {
            ...pose,
            [name]: { ...pose[name], [angle]: value },
        }
        this.setState({ hexapod: { ...this.state.hexapod, pose: newPose } })
    }

    updatePatternPose = (name, value) => {
        const { pose, dimensions } = this.state.hexapod
        let newPose = {}

        for (const leg in pose) {
            newPose[leg] = { ...pose[leg], [name]: Number(value) }
        }

        this.updatePlot(dimensions, newPose)
        this.setState({
            patternParams: { ...this.state.patternParams, [name]: value },
        })
    }

    logCameraView = relayoutData => {
        const newCameraView = relayoutData["scene.camera"]
        const plot = { ...this.state.plot, latestCameraView: newCameraView }
        this.setState({ ...this.state, plot: plot })
    }

    mightShowDimensions = () =>
        this.state.shouldDisplayDimensionsAndPlot ? (
            <DimensionsWidget
                dimensions={this.state.hexapod.dimensions}
                onUpdate={this.updateDimensions}
            />
        ) : null

    mightShowPlot = () => (
        <div
            className={
                this.state.shouldDisplayDimensionsAndPlot
                    ? "plot border"
                    : "no-display"
            }
        >
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
                    params={this.state.ikParams}
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
        <Router className="app">
            <NavBar />
            <div className="main">
                <div className="sidebar column-container cell">
                    <div className="page-content">
                        {this.mightShowDimensions()}
                        {this.showPage()}
                    </div>
                    <NavFooter />
                </div>
                {this.mightShowPlot()}
            </div>
        </Router>
    )
}

export default App
