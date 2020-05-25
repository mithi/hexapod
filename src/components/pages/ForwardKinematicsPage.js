import React, { Component } from "react"
import LegPoseWidget from "./LegPoseWidgetDefault"
import { Card, ToggleSwitch } from "../generic/SmallWidgets"
import InputField from "../generic/InputField"
import { Slider } from "../generic/Slider"

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

    componentDidMount() {
        this.props.onMount(this.pageName)
    }

    toggleMode = () => {
        console.log(this.state.mode)
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
            onUpdate={this.props.onUpdate}
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
