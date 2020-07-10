import React, { Component } from "react"
import { Card } from "../generic"
import { ANGLE_NAMES, RANGE_PARAMS } from "../vars"

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
                    rangeParams={RANGE_PARAMS[name]}
                    value={this.props.pose[name]}
                    handleChange={this.updateFieldState}
                />
            )
        })
    }

    render = () => (
        <Card title={<h3>{this.props.name}</h3>}>
            <div className={this.props.renderStacked ? "grid-cols-1" : "grid-cols-3"}>
                {this.fields(this.props.WidgetType)}
            </div>
        </Card>
    )
}

export default LegPoseWidget
