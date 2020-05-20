import React, {Component} from 'react';

const InputField= props => {
  return (
    <div className="input-field-widget">
      <label htmlFor={props.name} className="label">{props.name}</label>
      <input
        type="number"
        id={props.name}
        value={props.value}
        className="input"
        onChange={e => props.handleChange(props.name, e.target.value)}
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
      <input type="range" min={0} max={1.0} step={0.01} value={0.5} className="slider"/>
    </div>
  );
}

const StanceSlider = props => {
  return (
    <div className="slider-container">
      <label htmlFor="rotx" className="label">rotx</label>
      <input type="range" min={-90} max={90} step={0.5} value={0.0} className="slider"/>
    </div>
  );
}

class DimensionWidgets extends Component {

  state = {
    front: 100,
    side: 100,
    middle: 100,
    coxia: 100,
    femur: 100,
    tibia: 100,
  }

  updateFieldState = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  render() {
    const inputFields = Object.keys(this.state).map(name => {
      return <InputField key={name} name={name} value={this.state[name]} handleChange={this.updateFieldState}/>
    });
    return (
      <>
       <h2>Dimensions</h2>
       <form className="row-container">{inputFields}</form>
       </>
     );
  }
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
