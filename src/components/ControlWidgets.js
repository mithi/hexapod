import React, {Component} from 'react';


const TranslateSlider = props => {
  return (
    <div className="slider-container">
      <label htmlFor={props.name} className="label">{props.name}: {props.value}</label>
      <input
        type="range"
        min={-1.0}
        max={1.0}
        step={0.01}
        value={props.value}
        onChange={e => props.handleChange(props.name, e.target.value)}
        className="slider"
      />
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




class InverseKinematicsWidgets extends Component {
  state = {
    tx: 0,
    ty: 0,
    tz: 0,
  }

  updateFieldState = (name, value) => {
    this.setState({ [name]: value })
  }
  render() {
    return (
      <>
        <h2>Inverse Kinematics</h2>
        <div className="row-container">
          <TranslateSlider name="tx" handleChange={this.updateFieldState} value={this.state.tx}/>
          <TranslateSlider name="ty" handleChange={this.updateFieldState} value={this.state.ty}/>
          <TranslateSlider name="tz" handleChange={this.updateFieldState} value={this.state.tz}/>
        </div>
        <div className="row-container"><StanceSlider/><StanceSlider/></div>
      </>
      );
  }
}

export { InverseKinematicsWidgets };
