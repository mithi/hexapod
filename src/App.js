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

  updateDimensions = dimensions => {
    this.setState({ hexapod: { ...this.state.hexapod, dimensions: dimensions } });
  }
  render() {
    return (
      <>
        <NavBar/>
        <div className="app">
          <div className="sidebar">
            <DimensionWidgets handleChange={this.updateDimensions} />
            <ForwardKinematicsWidgets/>
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
