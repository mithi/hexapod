const BODY_MESH_COLOR = "#ff6348"
const BODY_MESH_OPACITY = 0.3
const BODY_COLOR = "#FC427B"
const BODY_OUTLINE_WIDTH = 12
const COG_COLOR = "#32ff7e"
const COG_SIZE = 14
const HEAD_SIZE = 14
const LEG_COLOR = "#EE5A24"
const LEG_OUTLINE_WIDTH = 10
const SUPPORT_POLYGON_MESH_COLOR = "#3c6382"
const SUPPORT_POLYGON_MESH_OPACITY = 0.2
const LEGENDS_BG_COLOR = "rgba(44, 62, 80, 0.8)"
const AXIS_ZERO_LINE_COLOR = "#079992"
const PAPER_BG_COLOR = "#222f3e"
const GROUND_COLOR = "#0a3d62"
const LEGEND_FONT_COLOR = "#2ecc71"

const DATA = [
    {
        name: "body mesh",
        showlegend: true,
        type: "mesh3d",
        opacity: BODY_MESH_OPACITY,
        color: BODY_MESH_COLOR,
        x: [100.0, 100.0, -100.0, -100.0, -100.0, 100.0, 100.0],
        y: [0.0, 100.0, 100.0, 0.0, -100.0, -100.0, 0.0],
        z: [100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0],
    },
    {
        line: { color: BODY_COLOR, opacity: 1.0, width: BODY_OUTLINE_WIDTH },
        name: "body",
        showlegend: true,
        type: "scatter3d",
        x: [100.0, 100.0, -100.0, -100.0, -100.0, 100.0, 100.0],
        y: [0.0, 100.0, 100.0, 0.0, -100.0, -100.0, 0.0],
        z: [100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0],
    },
    {
        marker: { color: COG_COLOR, opacity: 1, size: COG_SIZE },
        mode: "markers",
        name: "cog",
        type: "scatter3d",
        x: [0.0],
        y: [0.0],
        z: [100.0],
    },
    {
        marker: { color: BODY_COLOR, opacity: 1.0, size: HEAD_SIZE },
        mode: "markers",
        name: "head",
        type: "scatter3d",
        x: [0.0],
        y: [100.0],
        z: [100.0],
    },
    {
        line: { color: LEG_COLOR, width: LEG_OUTLINE_WIDTH },
        name: "leg 1",
        showlegend: false,
        type: "scatter3d",
        x: [100.0, 200.0, 300.0, 300.0],
        y: [0.0, 0.0, 0.0, 0.0],
        z: [100.0, 100.0, 100.0, 0.0],
    },
    {
        line: { color: LEG_COLOR, width: LEG_OUTLINE_WIDTH },
        name: "leg 2",
        showlegend: false,
        type: "scatter3d",
        x: [100.0, 170.71067811865476, 241.4213562373095, 241.4213562373095],
        y: [100.0, 170.71067811865476, 241.42135623730948, 241.42135623730948],
        z: [100.0, 100.0, 100.0, 0.0],
    },
    {
        line: { color: LEG_COLOR, width: LEG_OUTLINE_WIDTH },
        name: "leg 3",
        showlegend: false,
        type: "scatter3d",
        x: [-100.0, -170.71067811865476, -241.42135623730948, -241.42135623730948],
        y: [100.0, 170.71067811865476, 241.4213562373095, 241.4213562373095],
        z: [100.0, 100.0, 100.0, 0.0],
    },
    {
        line: { color: LEG_COLOR, width: LEG_OUTLINE_WIDTH },
        name: "leg 4",
        showlegend: false,
        type: "scatter3d",
        x: [-100.0, -200.0, -300.0, -300.0],
        y: [
            0.0,
            1.2246467991473532e-14,
            2.4492935982947064e-14,
            2.4492935982947064e-14,
        ],
        z: [100.0, 100.0, 100.0, 0.0],
    },
    {
        line: { color: LEG_COLOR, width: LEG_OUTLINE_WIDTH },
        name: "leg 5",
        showlegend: false,
        type: "scatter3d",
        x: [-100.0, -170.71067811865476, -241.42135623730954, -241.42135623730954],
        y: [-100.0, -170.71067811865476, -241.42135623730948, -241.42135623730948],
        z: [100.0, 100.0, 100.0, 0.0],
    },
    {
        line: { color: LEG_COLOR, width: LEG_OUTLINE_WIDTH },
        name: "leg 6",
        showlegend: false,
        type: "scatter3d",
        x: [100.0, 170.71067811865476, 241.42135623730948, 241.42135623730948],
        y: [-100.0, -170.71067811865476, -241.42135623730954, -241.42135623730954],
        z: [100.0, 100.0, 100.0, 0.0],
    },
    {
        name: "support polygon mesh",
        showlegend: true,
        type: "mesh3d",
        opacity: SUPPORT_POLYGON_MESH_OPACITY,
        color: SUPPORT_POLYGON_MESH_COLOR,
        x: [
            300.0,
            241.4213562373095,
            -241.42135623730948,
            -300.0,
            -241.42135623730954,
            241.42135623730948,
        ],
        y: [
            0.0,
            241.42135623730948,
            241.4213562373095,
            2.4492935982947064e-14,
            -241.42135623730948,
            -241.42135623730954,
        ],
        z: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    },
    {
        line: { color: "#2f3640", width: 2 },
        name: "hexapod x",
        mode: "lines",
        showlegend: false,
        opacity: 1.0,
        type: "scatter3d",
        x: [0.0, 50.0],
        y: [0.0, 0.0],
        z: [100.0, 100.0],
    },
    {
        line: { color: "#e67e22", width: 2 },
        name: "hexapod y",
        mode: "lines",
        showlegend: false,
        opacity: 1.0,
        type: "scatter3d",
        x: [0.0, 0.0],
        y: [0.0, 50.0],
        z: [100.0, 100.0],
    },
    {
        line: { color: "#0097e6", width: 2 },
        name: "hexapod z",
        mode: "lines",
        showlegend: false,
        opacity: 1.0,
        type: "scatter3d",
        x: [0.0, 0.0],
        y: [0.0, 0.0],
        z: [100.0, 150.0],
    },
    {
        line: { color: "#2f3640", width: 2 },
        name: "x direction",
        showlegend: false,
        mode: "lines",
        opacity: 1.0,
        type: "scatter3d",
        x: [0, 50],
        y: [0, 0],
        z: [0, 0],
    },
    {
        line: { color: "#e67e22", width: 2 },
        name: "y direction",
        showlegend: false,
        mode: "lines",
        opacity: 1.0,
        type: "scatter3d",
        x: [0, 0],
        y: [0, 50],
        z: [0, 0],
    },
    {
        line: { color: "#0097e6", width: 2 },
        name: "z direction",
        showlegend: false,
        mode: "lines",
        opacity: 1.0,
        type: "scatter3d",
        x: [0, 0],
        y: [0, 0],
        z: [0, 50],
    },
]

const SCENE = {
    xaxis: {
        nticks: 1,
        range: [-600, 600],
        zerolinecolor: AXIS_ZERO_LINE_COLOR,
        showbackground: false,
    },
    yaxis: {
        nticks: 1,
        range: [-600, 600],
        zerolinecolor: AXIS_ZERO_LINE_COLOR,
        showbackground: false,
    },
    zaxis: {
        nticks: 1,
        range: [-10, 600],
        zerolinecolor: AXIS_ZERO_LINE_COLOR,
        showbackground: true,
        backgroundcolor: GROUND_COLOR,
    },
    aspectmode: "manual",
    aspectratio: { x: 1, y: 1, z: 0.5 },
    camera: {
        center: {
            x: 0.0062108976108147355,
            y: 0.04549389872193933,
            z: -0.2516083317155232,
        },
        eye: {
            x: 0.3193783095920226,
            y: 0.6171526987735645,
            z: 0.3062618734999992,
        },
        up: { x: 0, y: 0, z: 1 },
    },
}

const LAYOUT = {
    scene: SCENE,
    margin: { b: 20, l: 10, r: 10, t: 20 },
    paper_bgcolor: PAPER_BG_COLOR,
    legend: {
        x: 0,
        y: 0,
        bgcolor: LEGENDS_BG_COLOR,
        font: { family: "courier", size: 12, color: LEGEND_FONT_COLOR },
    },
    autosize: true,
}

export { DATA, LAYOUT }
