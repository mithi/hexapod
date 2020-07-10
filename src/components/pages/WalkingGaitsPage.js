import React, { Component } from "react"
import { sliderList, Card, BasicButton, ToggleSwitch } from "../generic"
import { SECTION_NAMES, RESET_LABEL } from "../vars"
import getWalkSequence from "../../hexapod/solvers/walkSequenceSolver"
import PoseTable from "./PoseTable"
import { DEFAULT_POSE } from "../../templates"
import { VirtualHexapod } from "../../hexapod"
import { tRotZmatrix } from "../../hexapod/geometry"

const ANIMATION_DELAY = 1

const SLIDER_LABELS = [
    "tz",
    "tx",
    "legStance",
    "rx",
    "ry",
    "hipStance",
    "hipSwing",
    "liftSwing",
    "stepCount",
]

const PARAMS = {
    tx: { minVal: -0.25, maxVal: 0.25, stepVal: 0.01, defaultVal: 0 },
    tz: { minVal: -0.5, maxVal: 0.5, stepVal: 0.01, defaultVal: 0 },
    rx: { minVal: -15, maxVal: 15, stepVal: 0.5, defaultVal: 0 },
    ry: { minVal: -15, maxVal: 15, stepVal: 0.5, defaultVal: 0 },
    legStance: { minVal: -50, maxVal: 50, stepVal: 0.5, defaultVal: 0 },
    hipStance: { minVal: 20, maxVal: 40, stepVal: 0.5, defaultVal: 30 },
    hipSwing: { minVal: 10, maxVal: 40, stepVal: 0.5, defaultVal: 25 },
    liftSwing: { minVal: 10, maxVal: 70, stepVal: 0.5, defaultVal: 40 },
    stepCount: { minVal: 3, maxVal: 7, stepVal: 1, defaultVal: 5 },
}

const DEFAULT_GAIT_VARS = SLIDER_LABELS.reduce((gaitParams, gaitVar) => {
    gaitParams[gaitVar] = PARAMS[gaitVar].defaultVal
    return gaitParams
}, {})

const getPose = (seq, i) => {
    return Object.keys(seq).reduce((new_seq, legPosition) => {
        const { alpha, beta, gamma } = seq[legPosition]
        return {
            ...new_seq,
            [legPosition]: { alpha: alpha[i], beta: beta[i], gamma: gamma[i] },
        }
    }, {})
}

const newSwitch = (id, value, handleChange) => (
    <ToggleSwitch id={id} handleChange={handleChange} value={value} showValue={true} />
)

class WalkingGaitsPage extends Component {
    pageName = SECTION_NAMES.walkingGaits
    state = {
        gaitParams: DEFAULT_GAIT_VARS,
        pose: DEFAULT_POSE,
        isAnimating: false,
        isTripodGait: true,
        isForward: true,
        inWalkMode: true,
        showGaitWidgets: true,
        animationCount: 0,
        currentTwist: 0,
        totalStepCount: 0,
        deltaTwist: 0,
    }

    componentDidMount() {
        this.props.onMount(this.pageName)
        this.setWalkSequence(
            DEFAULT_GAIT_VARS,
            this.state.isTripodGait,
            this.state.inWalkMode
        )
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    toggleAnimating = () => {
        const isAnimating = !this.state.isAnimating

        if (isAnimating) {
            this.intervalID = setInterval(this.animate, ANIMATION_DELAY)
        } else {
            clearInterval(this.intervalID)
        }

        this.setState({ isAnimating })
    }

    toggleDirection = () => {
        this.setState({ isForward: !this.state.isForward })
    }

    toggleWalkMode = () => {
        const inWalkMode = !this.state.inWalkMode
        this.setWalkSequence(this.state.gaitParams, this.state.isTripodGait, inWalkMode)
        this.setState({ inWalkMode })
    }

    toggleGaitType = () => {
        const isTripodGait = !this.state.isTripodGait
        this.setWalkSequence(this.state.gaitParams, isTripodGait, this.state.inWalkMode)
        this.setState({ isTripodGait })
    }

    toggleWidgets = () => {
        this.setState({ showGaitWidgets: !this.state.showGaitWidgets })
    }

    animate = () => {
        const animationCount = (this.state.animationCount + 1) % this.state.totalStepCount
        this.setState({ animationCount })

        const step = this.state.isForward
            ? animationCount
            : this.state.totalStepCount - animationCount

        const pose = getPose(this.state.walkSequence, step)

        if (!this.inWalkMode) {
            const deltaTwist = this.state.deltaTwist
            const twist = this.state.isForward
                ? (this.state.currentTwist + deltaTwist) % 360
                : (this.state.currentTwist - deltaTwist) % 360

            this.onUpdate(pose, twist)
            this.setState({ currentTwist: twist })
            return
        }

        this.onUpdate(pose, 0)
    }

    onUpdate = (pose, twist) => {
        this.setState({ pose })
        const dimensions = this.props.params.dimensions

        if (twist !== 0) {
            const hexapod = new VirtualHexapod(dimensions, pose, { wontRotate: true })
            if (hexapod) {
                if (!hexapod.body) {
                    return
                }
                this.props.onUpdate(hexapod.cloneTrot(tRotZmatrix(twist)))
            }
            return
        }

        const hexapod = new VirtualHexapod(dimensions, pose)
        this.props.onUpdate(hexapod)
    }

    setWalkSequence = (gaitParams, isTripodGait, inWalkMode) => {
        const gaitType = isTripodGait ? "tripod" : "ripple"
        const walkMode = inWalkMode ? "walking" : "rotating"

        const walkSequence =
            getWalkSequence(
                this.props.params.dimensions,
                gaitParams,
                gaitType,
                walkMode
            ) || this.state.walkSequence

        const totalStepCount = walkSequence["leftMiddle"].alpha.length
        const pose = getPose(walkSequence, this.state.animationCount)

        this.setState({ gaitParams, walkSequence, totalStepCount })

        if (inWalkMode) {
            this.onUpdate(pose, 0)
            this.setState({ deltaTwist: 0, currentTwist: 0 })
            return
        }

        const deltaTwist = (gaitParams.hipSwing * 2) / totalStepCount
        this.onUpdate(pose, deltaTwist)
        this.setState({ deltaTwist })
    }

    updateGaitParams = (name, value) => {
        const gaitParams = { ...this.state.gaitParams, [name]: value }
        this.setWalkSequence(gaitParams, this.state.isTripodGait, this.state.inWalkMode)
    }

    reset = () => {
        this.setState({ gaitParams: DEFAULT_GAIT_VARS })
        this.setWalkSequence(
            DEFAULT_GAIT_VARS,
            this.state.isTripodGait,
            this.state.inWalkMode
        )
    }

    get widgetsSwitch() {
        const value = this.state.showGaitWidgets ? "controlsShown" : "poseShown"
        return newSwitch("widgetSw", value, this.toggleWidgets)
    }

    get animatingSwitch() {
        const value = this.state.isAnimating ? "PLAYING... " : "...PAUSED. "
        return newSwitch("animatingSw", value, this.toggleAnimating)
    }

    get gaitTypeSwitch() {
        const value = this.state.isTripodGait ? "tripodGait" : "rippleGait"
        return newSwitch("gaitSw", value, this.toggleGaitType)
    }

    get directionSwitch() {
        const value = this.state.isForward ? "goingForward" : "goingBackward"
        return newSwitch("directionSw", value, this.toggleDirection)
    }

    get rotateSwitch() {
        const value = this.state.inWalkMode ? "isWalking" : "isRotating"
        return newSwitch("rotateSw", value, this.toggleWalkMode)
    }

    get sliders() {
        const sliders = sliderList({
            names: SLIDER_LABELS,
            values: this.state.gaitParams,
            rangeParams: PARAMS,
            handleChange: this.updateGaitParams,
        })

        return (
            <>
                <div className="row-container">{sliders.slice(6, 9)}</div>
                <div className="row-container">{sliders.slice(0, 3)}</div>
                <div className="row-container">{sliders.slice(3, 6)}</div>
            </>
        )
    }

    get animationCount() {
        return <p hidden={!this.state.isAnimating}>{this.state.animationCount}</p>
    }

    threeSwitches = (switch1, switch2, switch3) => (
        <div className="row-container" style={{ padding: "8px" }}>
            <div className="cell">{switch1}</div>
            <div className="cell">{switch2}</div>
            <div className="cell">{switch3}</div>
        </div>
    )

    render = () => (
        <Card title={<h2>{this.pageName}</h2>} other={this.animationCount}>
            {this.threeSwitches(this.animatingSwitch, this.widgetsSwitch)}

            <div hidden={!this.state.showGaitWidgets}>
                {this.threeSwitches(
                    this.gaitTypeSwitch,
                    this.directionSwitch,
                    this.rotateSwitch
                )}
                {this.sliders}
                <BasicButton handleClick={this.reset}>{RESET_LABEL}</BasicButton>
            </div>

            <div hidden={this.state.showGaitWidgets}>
                <PoseTable pose={this.state.pose} />
            </div>
        </Card>
    )
}

export default WalkingGaitsPage
