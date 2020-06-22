import React, { Component } from "react"
import { Card } from "../generic"
import { ANGLE_NAMES } from "../texts"

class LegPoseWidget extends Component {
    updateFieldState = (angle, value) => {
        const numberValue = Number(value)
        if (!isNaN(numberValue)) {
            this.props.onUpdate(this.props.name, angle, numberValue)
        }
    }

    fields = Component => {
        return ANGLE_NAMES.map(name => {
            const newId = `${this.props.name}-${name}`
            return (
                <Component
                    key={newId}
                    name={name}
                    id={newId}
                    attributes={[-180, 180, 0.01]}
                    value={this.props.pose[name]}
                    handleChange={this.updateFieldState}
                />
            )
        })
    }

    render = () => (
        <Card title={this.props.name} h="h3" className="column-container">
            <div className={this.props.renderStacked ? "" : "row-container flex-wrap"}>
                {this.fields(this.props.WidgetType)}
            </div>
        </Card>
    )
}

export default LegPoseWidget
