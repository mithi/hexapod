import React, { Component } from 'react';

const DimensionInputField = props => {
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
  )
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
      value = value > 0 ? value : 0;
      this.setState({ [name]: value })
    }

    render() {
      const inputFields = Object.keys(this.state).map(name => {
        return <DimensionInputField key={name} name={name} value={this.state[name]} handleChange={this.updateFieldState}/>
      })
      return (
        <>
         <h2>Dimensions</h2>
         <form className="row-container">{inputFields}</form>
        </>
       )
    }
  }

export default DimensionWidgets