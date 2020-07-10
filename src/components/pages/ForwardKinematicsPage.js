import React, { Component } from "react"
import { renderToString } from "react-dom/server"
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

    state = { widgetType: NumberInputField }

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

    currentlySlider = () => this.state.widgetType === Slider

    toggleMode = () => {
        const widgetType = this.currentlySlider() ? NumberInputField : Slider
        this.setState({ widgetType })
    }

    makeCell = name => (
        <div className="cell">
            <LegPoseWidget
                key={name}
                name={name}
                pose={this.props.params.pose[name]}
                onUpdate={this.updatePose}
                WidgetType={this.state.widgetType}
                renderStacked={this.currentlySlider()}
            />
        </div>
    )

    get toggleSwitch() {
        return (
            <ToggleSwitch
                id="FwdKinematicsSwitch"
                value={renderToString(this.state.widgetType)}
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
