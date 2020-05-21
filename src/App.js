import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { NavBar, NavFooter } from "./components/Nav"
import HexapodPlot from "./components/HexapodPlot"
import DimensionWidgets from "./components/widgets/DimensionWidgets"
import ForwardKinematicsWidgets from "./components/widgets/ForwardKinematicsWidgets"
import InverseKinematicsWidgets from "./components/widgets/InverseKinematicsWidgets"
import LegPatternWidgets from "./components/widgets/LegPatternWidgets"
import { DATA, LAYOUT } from "./components/templates/plotParams"
import {
  DIMENSIONS,
  POSE,
  IK_PARAMS,
} from "./components/templates/hexapodParams"

class App extends React.Component {
  state = {
    currentPage: {},
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

  onFKPageLoad = () => {
    this.setState({
      currentPage: "forward kinematics",
    })

    this.setState({
      ikParams: IK_PARAMS,
    })
  }

  onIKPageLoad = () => {
    this.setState({
      currentPage: "inverse kinematics",
    })

    this.setState({
      pose: POSE,
    })
  }

  onPLPageLoad = () => {
    this.setState({
      currentPage: "leg patterns",
    })

    this.setState({
      pose: POSE,
    })

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

  logCameraView = (relayoutData) => {
    const newCameraView = relayoutData["scene.camera"]
    const plot = { ...this.state.plot, latestCameraView: newCameraView }
    this.setState({ ...this.state, plot: plot })
  }

  renderPageContent = () => {
    return (
      <Switch>
        <Route path="/" exact>
          <h2>Hello world!</h2>
        </Route>
        <Route path="/forward-kinematics">
          <ForwardKinematicsWidgets
            pose={this.state.hexapod.pose}
            onUpdate={this.updatePose}
            onMount={this.onFKPageLoad}
          />
        </Route>
        <Route path="/inverse-kinematics">
          <InverseKinematicsWidgets
            params={this.state.ikParams}
            onUpdate={this.updateIkParams}
            onMount={this.onIKPageLoad}
          />
        </Route>
        <Route path="/leg-patterns">
          <LegPatternWidgets
            params={this.state.patternParams}
            onUpdate={this.updatePatternPose}
            onMount={this.onLPPageLoad}
          />
        </Route>
      </Switch>
    )
  }

  render() {
    return (
      <Router>
        <NavBar />
        <div className="app">
          <div className="sidebar column-container">
            <DimensionWidgets
              dimensions={this.state.hexapod.dimensions}
              onUpdate={this.updateDimensions}
            />
            <div className="main-content">{this.renderPageContent()}</div>
            <NavFooter />
          </div>
          <div className="graph">
            <HexapodPlot
              data={this.state.plot.data}
              layout={this.state.plot.layout}
              onRelayout={this.logCameraView}
              revision={this.revisionCounter}
            />
          </div>
        </div>
      </Router>
    )
  }
}

export default App
