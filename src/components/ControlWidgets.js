import React from 'react';

const InputWidget = props => {
  return (
    <div className="input-field-widget">
      <label htmlFor={props.name} className="label">{props.name}</label>
      <input
        type="number"
        id={props.name}
        value={props.value}
        className="input"
        min={0}
        step={0}
      />
    </div>
  );
}


const Slider = () => {
    return (
        <div className="slider-container">
          <label htmlFor="rotx" className="label">rotx</label>
          <input type="range" min={0} max={1.0} step={0.01} value={0.5} class="slider"/>
        </div>
    );
  }


const DimensionWidgets = () => {
  return (
    <>
    <h2>DIMENSIONS</h2>
    <form className="row-container">
      <InputWidget name="FRONT" value={100} />
      <InputWidget name="SIDE" value={100} />
      <InputWidget name="BACK" value={100} />
      <InputWidget name="COXIA" value={100} />
      <InputWidget name="FEMUR" value={100} />
      <InputWidget name="TIBIA" value={100} />
    </form>
    </>
  );
}


const LegPoseWidgets = () => {
    return (
      <div className="column-container">
        <h3>(right middle)</h3>
        <form className="row-container">
          <InputWidget name="alpha" value={0} />
          <InputWidget name="beta" value={0} />
          <InputWidget name="gamma" value={0} />
        </form>
      </div>
    );
  }


const ForwardKinematicsWidgets = () => {
  return (
    <>
      <h2>Forward Kinematics</h2>
      <div className="row-container"><LegPoseWidgets/><LegPoseWidgets/></div>
      <div className="row-container"><LegPoseWidgets/><LegPoseWidgets/></div>
      <div className="row-container"><LegPoseWidgets/><LegPoseWidgets/></div>
    </>
  );
}


const InverseKinematicsWidgets = () => {
  return (
    <>
      <h2>Inverse Kinematics</h2>
      <div className="row-container"><Slider/><Slider/><Slider/></div>
      <div className="row-container"><Slider/><Slider/><Slider/></div>
      <div className="row-container"><Slider/><Slider/></div>

    </>
    );
}



export {DimensionWidgets, ForwardKinematicsWidgets, InverseKinematicsWidgets};