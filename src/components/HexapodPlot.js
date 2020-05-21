import React from "react"
import Plot from "react-plotly.js"
import { DATA, LAYOUT } from "./templates/plotParams"

const HexapodPlot = () => {
  return (
    <Plot
      data={DATA}
      layout={LAYOUT}
      useResizeHandler={true}
      style={{ height: "100%", width: "100%" }}
    />
  )
}

export default HexapodPlot
