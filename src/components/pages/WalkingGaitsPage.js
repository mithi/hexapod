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
    "hipSwing",
    "liftSwing",
    "legStance",
    "hipStance",
    "tx",
    "tz",
    "rx",
    "ry",
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
        walkSequence: null,
    }

    componentDidMount() {
        this.props.onMount(this.pageName)
        const { isTripodGait, inWalkMode } = this.state
        this.setWalkSequence(DEFAULT_GAIT_VARS, isTripodGait, inWalkMode)
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    animate = () => {
        const {
            isForward,
            inWalkMode,
            totalStepCount,
            deltaTwist,
            currentTwist,
            walkSequence,
        } = this.state

        const animationCount = (this.state.animationCount + 1) % totalStepCount
        this.setState({ animationCount })

        const tempStep = isForward ? animationCount : totalStepCount - animationCount
        const step = Math.max(0, Math.min(totalStepCount - 1, tempStep))

        const pose = getPose(walkSequence, step)

        if (inWalkMode) {
            this.onUpdate(pose, currentTwist)
            return
        }

        const twist = isForward
            ? (currentTwist + deltaTwist) % 360
            : (currentTwist - deltaTwist) % 360

        this.onUpdate(pose, twist)
    }

    onUpdate = (pose, currentTwist) => {
        this.setState({ pose, currentTwist })

        const dimensions = this.props.params.dimensions
        const hexapod = new VirtualHexapod(dimensions, pose, { wontRotate: true })

        // ❗❗️HACK When we've passed undefined pose values for some reason
        if (hexapod && hexapod.body) {
            this.props.onUpdate(hexapod.cloneTrot(tRotZmatrix(currentTwist)))
        }
    }

    setWalkSequence = (gaitParams, isTripodGait, inWalkMode) => {
        const gaitType = isTripodGait ? "tripod" : "ripple"
        const walkMode = inWalkMode ? "walking" : "rotating"

        const { dimensions } = this.props.params
        const { walkSequence, animationCount, currentTwist } = this.state

        const newWalkSequence =
            getWalkSequence(dimensions, gaitParams, gaitType, walkMode) || walkSequence

        const totalStepCount = newWalkSequence["leftMiddle"].alpha.length
        const newDeltaTwist = inWalkMode ? 0 : (gaitParams.hipSwing * 2) / totalStepCount

        const pose = getPose(newWalkSequence, animationCount)
        this.onUpdate(pose, currentTwist)
        this.setState({
            walkSequence: newWalkSequence,
            deltaTwist: newDeltaTwist,
            totalStepCount,
            gaitParams,
            isTripodGait,
            inWalkMode,
        })
    }

    updateGaitParams = (name, value) => {
        const { isTripodGait, inWalkMode } = this.state
        const gaitParams = { ...this.state.gaitParams, [name]: value }
        this.setWalkSequence(gaitParams, isTripodGait, inWalkMode)
    }

    reset = () => {
        this.setWalkSequence(DEFAULT_GAIT_VARS, true, true)
        this.setState({ currentTwist: 0 })
    }

    toggleWalkMode = () => {
        const { gaitParams, isTripodGait } = this.state
        const inWalkMode = !this.state.inWalkMode
        this.setWalkSequence(gaitParams, isTripodGait, inWalkMode)
    }

    toggleGaitType = () => {
        const { gaitParams, inWalkMode } = this.state
        const isTripodGait = !this.state.isTripodGait
        this.setWalkSequence(gaitParams, isTripodGait, inWalkMode)
    }

    toggleWidgets = () => {
        this.setState({ showGaitWidgets: !this.state.showGaitWidgets })
    }

    toggleDirection = () => {
        this.setState({ isForward: !this.state.isForward })
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

    get widgetsSwitch() {
        const value = this.state.showGaitWidgets ? "controlsShown" : "poseShown"
        return newSwitch("widgetSw", value, this.toggleWidgets)
    }

    get animatingSwitch() {
        const value = this.state.isAnimating ? "PLAYING..." : "...PAUSED. "
        return newSwitch("animatingSw", value, this.toggleAnimating)
    }

    get gaitTypeSwitch() {
        const value = this.state.isTripodGait ? "tripodGait" : "rippleGait"
        return newSwitch("gaitSw", value, this.toggleGaitType)
    }

    get directionSwitch() {
        const value = this.state.isForward ? "isForward" : "isBackward"
        return newSwitch("directionSw", value, this.toggleDirection)
    }

    get rotateSwitch() {
        const value = this.state.inWalkMode ? "isWalk" : "isRotate"
        return newSwitch("rotateSw", value, this.toggleWalkMode)
    }

    get sliders() {
        const sliders = sliderList({
            names: SLIDER_LABELS,
            values: this.state.gaitParams,
            rangeParams: PARAMS,
            handleChange: this.updateGaitParams,
        })

        return <div className="grid-cols-2">{sliders}</div>
    }

    get animationCount() {
        const { isAnimating, animationCount } = this.state
        return (
            <div className="text" hidden={!isAnimating}>
                {animationCount}
            </div>
        )
    }

    threeSwitches = (switch1, switch2, switch3) => (
        <div className="grid-cols-3" style={{ paddingBottom: "20px" }}>
            {switch1}
            {switch2}
            {switch3}
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
