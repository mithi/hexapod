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
        return ANGLE_NAMES.map(angle => {
            const id = `${this.props.name}-${angle}`
            const props = {
                id,
                name: angle,
                key: id,
                value: this.props.pose[angle],
                rangeParams: RANGE_PARAMS[angle],
                handleChange: this.updateFieldState,
            }

            return <Component {...props} />
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
