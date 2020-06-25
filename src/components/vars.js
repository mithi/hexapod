import React from "react"
import { GiCoffeeMug } from "react-icons/gi"
import { FaGithubAlt, FaTimes, FaCheck } from "react-icons/fa"
import { GrStatusGoodSmall } from "react-icons/gr"

const SECTION_NAMES = {
    dimensions: "Dimensions",
    inverseKinematics: "Inverse Kinematics",
    forwardKinematics: "Forward Kinematics",
    legPatterns: "Leg Patterns",
    landingPage: "Root",
}

const PATH_NAMES = {
    inverseKinematics: "/inverse-kinematics",
    forwardKinematics: "/forward-kinematics",
    legPatterns: "/leg-patterns",
    landingPage: "/",
}

const ANGLE_NAMES = ["alpha", "beta", "gamma"]
const DIMENSION_NAMES = ["front", "side", "middle", "coxia", "femur", "tibia"]
const LEG_NAMES = [
    "leftFront",
    "rightFront",
    "leftMiddle",
    "rightMiddle",
    "leftBack",
    "rightBack",
]

const IK_SLIDERS_LABELS = ["tx", "ty", "tz", "rx", "ry", "rz", "hipStance", "legStance"]
const RESET_LABEL = "reset"

/*************
 * RANGE PARAMS
 *************/

const rangeParams = absVal => ({ minVal: -absVal, maxVal: absVal, stepVal: 0.01 })
const RANGES = {
    30: rangeParams(30),
    45: rangeParams(45),
    60: rangeParams(60),
    90: rangeParams(90),
    180: rangeParams(180),
}

const translateInputs = { minVal: -1, maxVal: 1, stepVal: 0.01 }

const RANGE_PARAMS = {
    dimensionInputs: { minVal: 0, maxVal: Infinity, stepVal: 1 },
    tx: translateInputs,
    ty: translateInputs,
    tz: translateInputs,
    rx: RANGES[30],
    ry: RANGES[30],
    rz: RANGES[60],
    legStance: RANGES[90],
    hipStance: RANGES[60],
    alpha: RANGES[90],
    beta: RANGES[180],
    gamma: RANGES[180],
}

/*************
 * ICONS
 *************/

const ICON_COMPONENTS = {
    mug: <GiCoffeeMug className="vertical-align" />,
    circle: <GrStatusGoodSmall className="small-icon" />,
    octocat: <FaGithubAlt className="vertical-align" />,
    check: <FaCheck className="vertical-align" />,
    times: <FaTimes className="vertical-align" />,
}

/*************
 * NAVIGATION
 *************/

const PATHS = {
    inverseKinematics: {
        path: PATH_NAMES.inverseKinematics,
        description: SECTION_NAMES.inverseKinematics,
    },
    forwardKinematics: {
        path: PATH_NAMES.forwardKinematics,
        description: SECTION_NAMES.forwardKinematics,
    },
    legPatterns: {
        path: PATH_NAMES.legPatterns,
        description: SECTION_NAMES.legPatterns,
    },
    landingPage: {
        path: PATH_NAMES.landingPage,
        description: SECTION_NAMES.landingPage,
    },
}

const KOFI_LINK_PROPERTIES = {
    name: "KOFI",
    icon: ICON_COMPONENTS.mug,
    description: "Buy Mithi Ko-Fi 🍵",
    url: "https://ko-fi.com/minimithi",
}

const REPO_LINK_PROPERTIES = {
    name: "REPO",
    icon: ICON_COMPONENTS.octocat,
    description: "Source Code",
    url: "https://github.com/mithi/hexapod",
}

const PATH_LINKS = [
    PATHS.inverseKinematics,
    PATHS.forwardKinematics,
    PATHS.legPatterns,
    PATHS.landingPage,
]

const URL_LINKS = [KOFI_LINK_PROPERTIES, REPO_LINK_PROPERTIES]

/*************
 * LANDING PAGE
 *************/

const LANDING_PAGE_MESSAGE = `

# Mithi's Bare Minimum Hexapod Robot Simulator

- Solve (and visualize) [forward][1] and [inverse][2] kinematics purely on your browser!
It's a complete rewrite of the [one][3] I wrote in Python 🐍.
No more server-side computations!

- Consider buying me a [couple cups of coffee 🍵 🍵 🍵][4] to motivate me
to build other robotics related visualizers. (Quadrotors?!)

- Love coding? Any contribution [improve the source code][5] is welcome big or small. 💙

## Love, Mithi

[1]: /forward-kinematics
[2]: /inverse-kinematics
[3]: https://github.com/mithi/hexapod-robot-simulator
[4]: https://ko-fi.com/minimithi
[5]: https://github.com/mithi/hexapod/blob/master/CONTRIBUTING.md

`

export {
    ICON_COMPONENTS,
    LANDING_PAGE_MESSAGE,
    SECTION_NAMES,
    ANGLE_NAMES,
    DIMENSION_NAMES,
    LEG_NAMES,
    IK_SLIDERS_LABELS,
    RESET_LABEL,
    PATHS,
    URL_LINKS,
    PATH_LINKS,
    RANGE_PARAMS,
}
