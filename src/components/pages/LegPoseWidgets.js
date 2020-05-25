import React, { Component } from "react"
import { Card } from "../generic"

class LegPoseWidget extends Component {
    updateFieldState = (angle, value) => {
        if (value === "") {
            value = -1
        } else {
            value = Math.round(value * 100) / 100
            value = Math.min(Math.max(value, -180), 180)
        }
        this.props.onUpdate(this.props.name, angle, value)
    }

    inputFields = Component =>
        Object.keys(this.props.pose).map(name => (
            <Component
                key={name}
                name={name}
                params={[-180, 180, 0.01]}
                value={this.props.pose[name].toFixed(2).toString().padEnd(7, "0")}
                handleChange={this.updateFieldState}
            />
        ))

    render = () => (
        <Card title={this.props.name} h="h3" klass="column-container">
            <div
                className={this.props.renderStacked ? "" : "row-container flex-wrap"}
            >
                {this.inputFields(this.props.WidgetType)}
            </div>
        </Card>
    )
}

export default LegPoseWidget
