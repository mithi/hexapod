import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { VirtualHexapod, getNewPlotParams, solveInverseKinematics } from "./hexapod"
import {
    DEFAULT_DIMENSIONS,
    DEFAULT_POSE,
    DEFAULT_IK_PARAMS,
    DATA,
    LAYOUT,
    CAMERA_VIEW,
} from "./templates"
import {
    PoseTable,
    Nav,
    NavDetailed,
    HexapodPlot,
    DimensionsWidget,
    MessageBox,
} from "./components"

import {
    ForwardKinematicsPage,
    InverseKinematicsPage,
    LandingPage,
    LegPatternPage,
} from "./components/pages"

class App extends React.Component {
    state = {
        currentPage: "Root",
        inHexapodPage: false,
        showPoseMessage: true,
        showInfo: false,
        info: {},
        ikParams: DEFAULT_IK_PARAMS,
        patternParams: { alpha: 0, beta: 0, gamma: 0 },
        hexapod: {
            dimensions: DEFAULT_DIMENSIONS,
            pose: DEFAULT_POSE,
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
        if (pageName === "Root") {
            this.setState({
                inHexapodPage: false,
                currentPage: pageName,
                showInfo: false,
            })
            return
        }

        pageName === "Inverse Kinematics"
            ? this.setState({ showInfo: true })
            : this.setState({ showInfo: false })

        this.setState({
            inHexapodPage: true,
            currentPage: pageName,
            ikParams: DEFAULT_IK_PARAMS,
            hexapod: { ...this.state.hexapod, pose: DEFAULT_POSE },
            patternParams: { alpha: 0, beta: 0, gamma: 0 },
        })
        this.updatePlot(this.state.hexapod.dimensions, DEFAULT_POSE)
    }

    updatePlot = (dimensions, pose) => {
        const newHexapodModel = new VirtualHexapod(dimensions, pose)
        this.updatePlotWithHexapod(newHexapodModel)
    }

    updatePlotWithHexapod = hexapod => {
        const [data, layout] = getNewPlotParams(hexapod, this.state.plot.latestCameraView)
        this.setState({
            plot: {
                ...this.state.plot,
                data,
                layout,
                revisionCounter: this.state.plot.revisionCounter + 1,
            },
            hexapod: {
                ...this.state.hexapod,
                dimensions: hexapod.dimensions,
                pose: hexapod.pose,
            },
        })
    }

    updateDimensions = (name, value) => {
        const dimensions = { ...this.state.hexapod.dimensions, [name]: value }
        this.updatePlot(dimensions, this.state.hexapod.pose)
    }

    updateIkParams = (name, value) => {
        const newIkParams = { ...this.state.ikParams, [name]: value }

        const { dimensions } = this.state.hexapod
        const result = solveInverseKinematics(dimensions, newIkParams)

        if (result.obtainedSolution) {
            this.updatePlotWithHexapod(result.hexapod)
            this.setState({
                showPoseMessage: true,
                info: { ...result.message, isAlert: false },
            })
        } else {
            this.setState({
                showPoseMessage: false,
                info: { ...result.message, isAlert: true },
            })
        }

        this.setState({ ikParams: newIkParams })
    }

    updatePose = (name, angle, value) => {
        const { pose, dimensions } = this.state.hexapod
        const newPose = {
            ...pose,
            [name]: { ...pose[name], [angle]: value },
        }
        this.updatePlot(dimensions, newPose)
    }

    updatePatternPose = (name, value) => {
        const { pose, dimensions } = this.state.hexapod
        let newPose = {}

        for (const leg in pose) {
            newPose[leg] = { ...pose[leg], [name]: Number(value) }
        }

        this.setState({
            patternParams: { ...this.state.patternParams, [name]: value },
        })
        this.updatePlot(dimensions, newPose)
    }

    logCameraView = relayoutData => {
        const newCameraView = relayoutData["scene.camera"]
        const plot = { ...this.state.plot, latestCameraView: newCameraView }
        this.setState({ ...this.state, plot: plot })
    }

    mightShowMessage = () =>
        this.state.showInfo ? <MessageBox info={this.state.info} /> : null

    mightShowDetailedNav = () => (this.state.inHexapodPage ? <NavDetailed /> : null)

    mightShowPoseTable = () => {
        if (this.state.currentPage !== "Inverse Kinematics") {
            return null
        }

        if (this.state.showPoseMessage) {
            return <PoseTable pose={this.state.hexapod.pose} />
        }
    }

    mightShowDimensions = () =>
        this.state.inHexapodPage ? (
            <DimensionsWidget
                dimensions={this.state.hexapod.dimensions}
                onUpdate={this.updateDimensions}
            />
        ) : null

    mightShowPlot = () => (
        <div className={this.state.inHexapodPage ? "plot border" : "no-display"}>
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
        <Router>
            <Nav />
            <div className="main content">
                <div className="sidebar column-container cell">
                    {this.mightShowDimensions()}
                    {this.showPage()}
                    {this.mightShowPoseTable()}
                    {this.mightShowMessage()}
                </div>
                {this.mightShowPlot()}
            </div>
            {this.mightShowDetailedNav()}
        </Router>
    )
}

export default App
