import React from 'react';

const InputField= props => {
  return (
    <div className="input-field-widget">
      <label htmlFor={props.name} className="label">{props.name}</label>
      <input
        type="number"
        id={props.name}
        value={props.value}
        className="input"
        min={0}
        step={1}
      />
    </div>
  );
}


const IKSlider = () => {
  return (
    <div className="slider-container">
      <label htmlFor="rotx" className="label">rotx</label>
      <input type="range" min={0} max={1.0} step={0.01} value={0.5} class="slider"/>
    </div>
  );
}

const StanceSlider = () => {
  return (
    <div className="slider-container">
      <label htmlFor="rotx" className="label">rotx</label>
      <input type="range" min={-90} max={90} step={0.5} value={0.0} class="slider"/>
    </div>
  );
}

const DimensionWidgets = () => {
  return (
    <>
    <h2>Dimensions</h2>
    <form className="row-container">
      <InputField name="FRONT" value={100} />
      <InputField name="SIDE" value={100} />
      <InputField name="BACK" value={100} />
      <InputField name="COXIA" value={100} />
      <InputField name="FEMUR" value={100} />
      <InputField name="TIBIA" value={100} />
    </form>
    </>
  );
}


const LegPoseWidgets = () => {
    return (
      <div className="column-container">
        <h3>(right middle)</h3>
        <form className="row-container">
          <InputField name="alpha" value={0} />
          <InputField name="beta" value={0} />
          <InputField name="gamma" value={0} />
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
      <div className="row-container"><IKSlider/><IKSlider/><IKSlider/></div>
      <div className="row-container"><IKSlider/><IKSlider/><IKSlider/></div>
      <div className="row-container"><StanceSlider/><StanceSlider/></div>

    </>
    );
}



export { DimensionWidgets, ForwardKinematicsWidgets, InverseKinematicsWidgets };
