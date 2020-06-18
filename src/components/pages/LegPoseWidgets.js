import React, { Component } from "react"
import { Card } from "../generic"

class LegPoseWidget extends Component {
    updateFieldState = (angle, value) => {
        const numberValue = Number(value)
        if (!isNaN(numberValue)) {
            this.props.onUpdate(this.props.name, angle, numberValue)
        }
    }

    fields = Component =>
        Object.keys(this.props.pose).map(name => (
            <Component
                key={name}
                name={name}
                id={`${this.props.name}-${name}`}
                attributes={[-180, 180, 0.01]}
                value={this.props.pose[name]}
                handleChange={this.updateFieldState}
            />
        ))

    render = () => (
        <Card title={this.props.name} h="h3" className="column-container">
            <div className={this.props.renderStacked ? "" : "row-container flex-wrap"}>
                {this.fields(this.props.WidgetType)}
            </div>
        </Card>
    )
}

export default LegPoseWidget
