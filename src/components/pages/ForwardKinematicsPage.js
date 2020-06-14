import React, { Component } from "react"
import LegPoseWidget from "./LegPoseWidgets"
import { Card, ToggleSwitch, BasicButton, NumberInputField, Slider } from "../generic"
import { DEFAULT_POSE } from "../../templates"

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
    pageName = "Forward Kinematics"
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

    get resetButton() {
        return <BasicButton handleClick={this.reset}>Reset</BasicButton>
    }

    get toggleSwitch() {
        return (
            <ToggleSwitch
                value={this.state.widgetType}
                handleChange={this.toggleMode}
                showLabel={false}
            />
        )
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

    render = () => {
        const legNames = [
            "leftFront",
            "rightFront",
            "leftMiddle",
            "rightMiddle",
            "leftBack",
            "rightBack",
        ]
        const cells = legNames.map(name => this.makeCell(name))
        const header = () => (
            <div className="row-container flex-wrap">
                <h2>{this.pageName}</h2>
                {this.toggleSwitch}
            </div>
        )
        return (
            <Card title={header()} h="div">
                {renderTwoColumns(cells)}
                {this.resetButton}
            </Card>
        )
    }
}

export default ForwardKinematicsPage
