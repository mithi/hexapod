import React, { Component } from "react"
import LegPoseWidget from "./LegPoseWidgets"
import { Card, ToggleSwitch, InputField, Slider } from "../generic"

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
        InputField: InputField,
    }

    state = { modeBool: false, widgetType: "InputField" }

    updatePose = (name, angle, value) => {
        const pose = this.props.params
        const newPose = {
            ...pose,
            [name]: { ...pose[name], [angle]: value },
        }
        this.props.onUpdate(newPose)
    }

    componentDidMount() {
        this.props.onMount(this.pageName)
    }

    toggleMode = () => {
        const newModeBool = !this.state.modeBool
        this.setState({
            modeBool: newModeBool,
            widgetType: newModeBool ? "Slider" : "InputField",
        })
    }

    makeCell = name => (
        <LegPoseWidget
            key={name}
            name={name}
            pose={this.props.params[name]}
            onUpdate={this.updatePose}
            WidgetType={this.widgetTypes[this.state.widgetType]}
            renderStacked={this.state.modeBool}
        />
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
                <ToggleSwitch
                    value={this.state.widgetType}
                    handleChange={this.toggleMode}
                    showLabel={false}
                />
            </div>
        )
        return (
            <Card title={header()} h="div">
                {renderTwoColumns(cells)}
            </Card>
        )
    }
}

export default ForwardKinematicsPage
