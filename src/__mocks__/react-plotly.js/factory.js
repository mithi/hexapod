import React from "react"

const createPlotlyComponent = () => ({ style, testId }) => (
    <div style={style} data-testid={testId}></div>
)

export default createPlotlyComponent
