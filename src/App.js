import React from 'react';
import { NavBar, NavFooter } from './components/Nav';
import HexapodPlot from './components/HexapodPlot'
import DimensionWidgets from './components/DimensionWidgets'
import ForwardKinematicsWidgets from './components/ForwardKinematicsWidgets'
import InverseKinematicsWidgets from './components/InverseKinematicsWidgets';

class App extends React.Component {
  state = {
    currentPage: {},
    ikParams: {},
    hexapod: {
      dimensions: {},
      pose: {},
      points: {},
    }
  }

  updateDimensions = (name, value) => {
    const dimensions = {...this.state.hexapod.dimensions, [name]: value}
    this.setState({ hexapod: { ...this.state.hexapod, dimensions:  dimensions} })
  }

  updatePose = (legName, angle, value) => {
    const { pose } = this.state.hexapod
    const newPose = {...pose, [legName]: {...pose[legName], [angle]: value }}
    this.setState({ hexapod: { ...this.state.hexapod, pose: newPose }})
  }

  render() {
    return (
      <>
        <NavBar/>
        <div className="app">
          <div className="sidebar">
            <DimensionWidgets onUpdate={this.updateDimensions} />
            <ForwardKinematicsWidgets onUpdate={this.updatePose} />
            <InverseKinematicsWidgets/>
          </div>
          <div className="graph"><HexapodPlot/></div>
        </div>
        <NavFooter/>
      </>
    )
  }
}

export default App
