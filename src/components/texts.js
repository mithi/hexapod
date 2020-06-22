const SECTION_NAMES = {
    dimensions: "Dimensions",
    inverseKinematics: "Inverse Kinematics",
    forwardKinematics: "Forward Kinematics",
    legPatterns: "Leg Patterns",
    landingPage: "Root",
}

const PATHS = {
    inverseKinematics: {
        path: "/inverse-kinematics",
        description: SECTION_NAMES.inverseKinematics,
    },
    forwardKinematics: {
        path: "/forward-kinematics",
        description: SECTION_NAMES.forwardKinematics,
    },
    legPatterns: { path: "/leg-patterns", description: SECTION_NAMES.legPatterns },
    landingPage: { path: "/", description: SECTION_NAMES.landingPage },
}

const PATH_LINKS = [
    PATHS.inverseKinematics,
    PATHS.forwardKinematics,
    PATHS.legPatterns,
    PATHS.landingPage,
]

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
const ROTATE_SLIDERS_LABELS = ["rx", "ry", "rz", "hipStance", "legStance"]
const RESET_LABEL = "reset"
const TRANSLATE_SLIDERS_LABELS = ["tx", "ty", "tz"]

/*************
 * NAVIGATION
 *************/

const URLS = {
    KOFI: "https://ko-fi.com/minimithi",
    REPO: "https://github.com/mithi/hexapod",
}

const LINK_DESCRIPTIONS = {
    KOFI: "Buy Mithi Ko-Fi 🍵",
    REPO: "Source Code",
}

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

- Any contribution to improve the source code will be extremely appreciated. 💙
Anything from fixing typographical errors to completely changing the page design ... or even rewriting
modules to follow better software practices. [How you can help][5].

## Love, Mithi

[1]: /forward-kinematics
[2]: /inverse-kinematics
[3]: https://github.com/mithi/hexapod-robot-simulator
[4]: https://ko-fi.com/minimithi
[5]: https://github.com/mithi/hexapod/wiki/Types-of-(code)-Contributions

`

export {
    LANDING_PAGE_MESSAGE,
    SECTION_NAMES,
    ANGLE_NAMES,
    DIMENSION_NAMES,
    LEG_NAMES,
    TRANSLATE_SLIDERS_LABELS,
    ROTATE_SLIDERS_LABELS,
    RESET_LABEL,
    PATHS,
    PATH_LINKS,
    URLS,
    LINK_DESCRIPTIONS,
}
