import Plotly from "plotly.js/lib/core"
import Scatter3d from "plotly.js/lib/scatter3d"
import Mesh3d from "plotly.js/lib/mesh3d"

import createPlotlyComponent from "react-plotly.js/factory"
Plotly.register([Scatter3d, Mesh3d])

const CustomPlotly = createPlotlyComponent(Plotly)
export default CustomPlotly
