import React from "react"
import { NavBar, NavFooter } from "./components/Nav"
import HexapodPlot from "./components/HexapodPlot"
import DimensionWidgets from "./components/DimensionWidgets"
import ForwardKinematicsWidgets from "./components/ForwardKinematicsWidgets"
import InverseKinematicsWidgets from "./components/InverseKinematicsWidgets"

const INITIAL_DIMENSIONS = {
  front: 100,
  side: 100,
  middle: 100,
  coxia: 100,
  femur: 100,
  tibia: 100,
}

const INITIAL_POSE = {
  leftFront: { alpha: 0, beta: 0, gamma: 0 },
  rightFront: { alpha: 0, beta: 0, gamma: 0 },
  leftMiddle: { alpha: 0, beta: 0, gamma: 0 },
  rightMiddle: { alpha: 0, beta: 0, gamma: 0 },
  leftBack: { alpha: 0, beta: 0, gamma: 0 },
  rightBack: { alpha: 0, beta: 0, gamma: 0 },
}

const INITIAL_IK_PARAMS = {
  tx: 0,
  ty: 0,
  tz: 0,
  rx: 0,
  ry: 0,
  rz: 0,
  hipStance: 0,
  legStance: 0,
}

class App extends React.Component {
  state = {
    currentPage: {},
    ikParams: INITIAL_IK_PARAMS,
    alerts: "",
    messages: "",
    hexapod: {
      dimensions: INITIAL_DIMENSIONS,
      pose: INITIAL_POSE,
      points: {},
    },
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

  updatePose = (legName, angle, value) => {
    const { pose } = this.state.hexapod
    const newPose = {
      ...pose,
      [legName]: { ...pose[legName], [angle]: value },
    }
    this.setState({ hexapod: { ...this.state.hexapod, pose: newPose } })
  }

  render() {
    return (
      <>
        <NavBar />
        <div className="app">
          <div className="sidebar">
            <DimensionWidgets
              dimensions={this.state.hexapod.dimensions}
              onUpdate={this.updateDimensions}
            />
            <ForwardKinematicsWidgets
              pose={this.state.hexapod.pose}
              onUpdate={this.updatePose}
            />
            <InverseKinematicsWidgets
              params={this.state.ikParams}
              onUpdate={this.updateIkParams}
            />
          </div>
          <div className="graph">
            <HexapodPlot />
          </div>
        </div>
        <NavFooter />
      </>
    )
  }
}

export default App
