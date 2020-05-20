import React from 'react';
import { NavBar, NavFooter } from './components/Nav';
import { DimensionWidgets, ForwardKinematicsWidgets, InverseKinematicsWidgets } from './components/ControlWidgets';
import HexapodPlot from './components/HexapodPlot'

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

export default App;
