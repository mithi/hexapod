const BODY_MESH_COLOR = "#ff6348"
const BODY_COLOR = "#FC427B"
const COG_COLOR = "#32ff7e"
const LEG_COLOR = "#EE5A24"
const SUPPORT_POLYGON_MESH_COLOR = "#3c6382"
const AXIS_ZERO_LINE_COLOR = "#079992"
const PAPER_BG_COLOR = "rgb(23, 33, 43)"
const GROUND_COLOR = "rgb(14, 40, 69)"

const BODY_MESH_OPACITY = 0.3
const BODY_OUTLINE_WIDTH = 12
const COG_SIZE = 14
const HEAD_SIZE = 14
const LEG_OUTLINE_WIDTH = 10
const SUPPORT_POLYGON_MESH_OPACITY = 0.2

const DATA_INDEX_MAP = {
    bodyMesh: 0,
    bodyOutline: 1,
    head: 2,
    centerOfGravity: 3,
    centerOfGravityProjection: 4,
    rightMiddleLeg: 5,
    rightFrontLeg: 6,
    leftFrontLeg: 7,
    leftMiddleLeg: 8,
    leftBackLeg: 9,
    rightBackLeg: 10,
    supportPolygonMesh: 11,
    hexapodXaxis: 12,
    hexapodYaxis: 13,
    hexapodZaxis: 14,
    worldXaxis: 15,
    worldYaxis: 16,
    worldZaxis: 17,
}

const DATA = [
    {
        name: "bodyMesh",
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
        name: "bodyOutline",
        showlegend: true,
        type: "scatter3d",
        x: [100.0, 100.0, -100.0, -100.0, -100.0, 100.0, 100.0],
        y: [0.0, 100.0, 100.0, 0.0, -100.0, -100.0, 0.0],
        z: [100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0],
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
        marker: { color: COG_COLOR, opacity: 1, size: COG_SIZE },
        mode: "markers",
        name: "centerOfGravity",
        type: "scatter3d",
        x: [0.0],
        y: [0.0],
        z: [100.0],
    },
    {
        marker: { color: COG_COLOR, opacity: 0.5, size: 0.5 * COG_SIZE },
        mode: "markers",
        name: "centerOfGravityProjection",
        type: "scatter3d",
        x: [0.0],
        y: [0.0],
        z: [0.0],
    },
    {
        line: { color: LEG_COLOR, width: LEG_OUTLINE_WIDTH },
        name: "rightMiddleLeg",
        showlegend: false,
        type: "scatter3d",
        x: [100.0, 200.0, 300.0, 300.0],
        y: [0.0, 0.0, 0.0, 0.0],
        z: [100.0, 100.0, 100.0, 0.0],
    },
    {
        line: { color: LEG_COLOR, width: LEG_OUTLINE_WIDTH },
        name: "rightFrontLeg",
        showlegend: false,
        type: "scatter3d",
        x: [100.0, 170.71067811865476, 241.4213562373095, 241.4213562373095],
        y: [100.0, 170.71067811865476, 241.42135623730948, 241.42135623730948],
        z: [100.0, 100.0, 100.0, 0.0],
    },
    {
        line: { color: LEG_COLOR, width: LEG_OUTLINE_WIDTH },
        name: "leftFrontLeg",
        showlegend: false,
        type: "scatter3d",
        x: [-100.0, -170.71067811865476, -241.42135623730948, -241.42135623730948],
        y: [100.0, 170.71067811865476, 241.4213562373095, 241.4213562373095],
        z: [100.0, 100.0, 100.0, 0.0],
    },
    {
        line: { color: LEG_COLOR, width: LEG_OUTLINE_WIDTH },
        name: "leftMiddleLeg",
        showlegend: false,
        type: "scatter3d",
        x: [-100.0, -200.0, -300.0, -300.0],
        y: [0.0, 1.2246467991473532e-14, 2.4492935982947064e-14, 2.4492935982947064e-14],
        z: [100.0, 100.0, 100.0, 0.0],
    },
    {
        line: { color: LEG_COLOR, width: LEG_OUTLINE_WIDTH },
        name: "leftBackLeg",
        showlegend: false,
        type: "scatter3d",
        x: [-100.0, -170.71067811865476, -241.42135623730954, -241.42135623730954],
        y: [-100.0, -170.71067811865476, -241.42135623730948, -241.42135623730948],
        z: [100.0, 100.0, 100.0, 0.0],
    },
    {
        line: { color: LEG_COLOR, width: LEG_OUTLINE_WIDTH },
        name: "rightBackLeg",
        showlegend: false,
        type: "scatter3d",
        x: [100.0, 170.71067811865476, 241.42135623730948, 241.42135623730948],
        y: [-100.0, -170.71067811865476, -241.42135623730954, -241.42135623730954],
        z: [100.0, 100.0, 100.0, 0.0],
    },
    {
        name: "supportPolygonMesh",
        showlegend: false,
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
        name: "hexapodXaxis",
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
        name: "hexapodYaxis",
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
        name: "hexapodZaxis",
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
        name: "worldXaxis",
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
        name: "worldYaxis",
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
        name: "worldZaxis",
        showlegend: false,
        mode: "lines",
        opacity: 1.0,
        type: "scatter3d",
        x: [0, 0],
        y: [0, 0],
        z: [0, 50],
    },
]

const CAMERA_VIEW = {
    center: {
        x: 0.0005967195135552272,
        y: 0.11455181630825005,
        z: -0.44957387699746415,
    },
    eye: {
        x: 0.010119765679525836,
        y: 0.573601223004958,
        z: 0.04247372257492105,
    },
    up: {
        x: 0.006592638138864914,
        y: 0.00003338632363222382,
        z: 0.9999782677677168,
    },
}

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
        range: [-10, 590],
        zerolinecolor: AXIS_ZERO_LINE_COLOR,
        showbackground: true,
        backgroundcolor: GROUND_COLOR,
    },
    aspectmode: "manual",
    aspectratio: { x: 1, y: 1, z: 1 },
    camera: CAMERA_VIEW,
}

const LAYOUT = {
    scene: SCENE,
    margin: { b: 20, l: 10, r: 10, t: 20 },
    paper_bgcolor: PAPER_BG_COLOR,
    showlegend: false,
    autosize: true,
}

export { DATA, LAYOUT, DATA_INDEX_MAP, SCENE, CAMERA_VIEW }
