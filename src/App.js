import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { NavBar, NavFooter } from "./components/Nav"
import { DATA, LAYOUT } from "./components/templates/plotParams"
import { DIMENSIONS, POSE, IK_PARAMS } from "./components/templates/hexapodParams"
import HexapodPlot from "./components/HexapodPlot"
import DimensionWidgets from "./components/DimensionWidgets"
import ForwardKinematicsPage from "./components/ForwardKinematicsPage"
import InverseKinematicsPage from "./components/InverseKinematicsPage"
import LandingPage from "./components/LandingPage"
import LegPatternPage from "./components/LegPatternPage"

class App extends React.Component {
    state = {
        currentPage: "Root",
        ikParams: IK_PARAMS,
        patternParams: { alpha: 0, beta: 0, gamma: 0 },
        alerts: "",
        messages: "",
        hexapod: {
            dimensions: DIMENSIONS,
            pose: POSE,
            points: {},
        },
        plot: {
            data: DATA,
            layout: LAYOUT,
            latestCameraView: {},
            revisionCounter: 0,
        },
    }

    onPageLoad = pageName => {
        this.setState({ currentPage: pageName })
        this.setState({ ikParams: IK_PARAMS })
        this.setState({ hexapod: { ...this.state.hexapod, pose: POSE } })
        this.setState({
            patternParams: { alpha: 0, beta: 0, gamma: 0 },
        })
    }

    updateDimensions = (name, value) => {
        const dimensions = { ...this.state.hexapod.dimensions, [name]: value }
        this.setState({
            hexapod: { ...this.state.hexapod, dimensions: dimensions },
        })
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
        const { pose } = this.state.hexapod
        let newPose = {}

        for (const leg in pose) {
            newPose[leg] = { ...pose[leg], [name]: value }
        }

        this.setState({ hexapod: { ...this.state.hexapod, pose: newPose } })
        this.setState({
            patternParams: { ...this.state.patternParams, [name]: value },
        })
    }

    logCameraView = relayoutData => {
        const newCameraView = relayoutData["scene.camera"]
        const plot = { ...this.state.plot, latestCameraView: newCameraView }
        this.setState({ ...this.state, plot: plot })
    }

    mightShowDimensions = () => (
        this.state.currentPage !== "Root" ? (
            <DimensionWidgets
                dimensions={this.state.hexapod.dimensions}
                onUpdate={this.updateDimensions}
            />
        ) : null
    )

    mightShowPlot = () => (
        <div
            className={
                this.state.currentPage === "Root" ? "no-display" : "plot border"
            }
        >
            <HexapodPlot
                data={this.state.plot.data}
                layout={this.state.plot.layout}
                onRelayout={this.logCameraView}
                revision={this.revisionCounter}
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
