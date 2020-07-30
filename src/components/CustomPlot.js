import Plotly from "plotly.js/lib/core";
import Scatter3d from "plotly.js/lib/scatter3d"
import createPlotlyComponent from "react-plotly.js/factory";
Plotly.register([Scatter3d]);

const CustomPlotly = createPlotlyComponent(Plotly);
export default CustomPlotly;
