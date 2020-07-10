import React, { Component } from "react"
import LegPoseWidget from "./LegPoseWidgets"
import { Card, ToggleSwitch, BasicButton, NumberInputField, Slider } from "../generic"
import { DEFAULT_POSE } from "../../templates"
import { SECTION_NAMES, LEG_NAMES, RESET_LABEL } from "../vars"

const renderTwoColumns = cells => (
    <>
        <div className="row-container">
            {cells[0]}
            {cells[1]}
        </div>
        <div className="row-container">
            {cells[2]}
            {cells[3]}
        </div>
        <div className="row-container">
            {cells[4]}
            {cells[5]}
        </div>
    </>
)

class ForwardKinematicsPage extends Component {
    pageName = SECTION_NAMES.forwardKinematics

    widgetTypes = {
        Slider: Slider,
        NumberInputField: NumberInputField,
    }

    state = { modeBool: false, widgetType: "NumberInputField" }

    componentDidMount() {
        this.props.onMount(this.pageName)
    }

    reset = () => {
        this.props.onUpdate(DEFAULT_POSE)
    }

    updatePose = (name, angle, value) => {
        const pose = this.props.params.pose
        const newPose = {
            ...pose,
            [name]: { ...pose[name], [angle]: value },
        }
        this.props.onUpdate(newPose)
    }

    toggleMode = () => {
        const newModeBool = !this.state.modeBool
        this.setState({
            modeBool: newModeBool,
            widgetType: newModeBool ? "Slider" : "NumberInputField",
        })
    }

    makeCell = name => (
        <div className="cell">
            <LegPoseWidget
                key={name}
                name={name}
                pose={this.props.params.pose[name]}
                onUpdate={this.updatePose}
                WidgetType={this.widgetTypes[this.state.widgetType]}
                renderStacked={this.state.modeBool}
            />
        </div>
    )

    get toggleSwitch() {
        return (
            <ToggleSwitch
                id="FwdKinematicsSwitch"
                value={this.state.widgetType}
                handleChange={this.toggleMode}
                showValue={false}
            />
        )
    }

    render = () => (
        <Card title={<h2>{this.pageName}</h2>} other={this.toggleSwitch}>
            {renderTwoColumns(LEG_NAMES.map(name => this.makeCell(name)))}
            <BasicButton handleClick={this.reset}>{RESET_LABEL}</BasicButton>
        </Card>
    )
}

export default ForwardKinematicsPage
