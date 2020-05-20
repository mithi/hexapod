import React from 'react';
import { NavBar, NavFooter } from './components/Nav';
import HexapodPlot from './components/HexapodPlot'
import DimensionWidgets from './components/DimensionWidgets'
import ForwardKinematicsWidgets from './components/ForwardKinematicsWidgets'
import InverseKinematicsWidgets from './components/InverseKinematicsWidgets';

class App extends React.Component {

  render() {
    return (
      <>
        <NavBar />
        <div className="app">
          <div className="sidebar">
            <DimensionWidgets/>
            <ForwardKinematicsWidgets/>
            <InverseKinematicsWidgets/>
          </div>
          <div className="graph"><HexapodPlot /></div>
        </div>
        <NavFooter/>
      </>
    );
  }
}

export default App
