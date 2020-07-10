import React, { Component } from "react"
import { sliderList, Card, BasicButton, ToggleSwitch } from "../generic"
import { SECTION_NAMES, RESET_LABEL } from "../vars"
import getWalkSequence from "../../hexapod/solvers/walkSequenceSolver"
import PoseTable from "./PoseTable"
import { DEFAULT_POSE } from "../../templates"
import { VirtualHexapod } from "../../hexapod"

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
        showGaitWidgets: true,
        animationCount: 0,
        totalStepCount: 0,
    }

    componentDidMount() {
        this.props.onMount(this.pageName)
        this.setWalkSequence(DEFAULT_GAIT_VARS, this.state.isTripodGait)
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

    toggleGaitType = () => {
        const isTripodGait = !this.state.isTripodGait
        this.setWalkSequence(this.state.gaitParams, isTripodGait)
        this.setState({ isTripodGait })
    }

    toggleWidgets = () => {
        this.setState({ showGaitWidgets: !this.state.showGaitWidgets })
    }

    animate = () => {
        const animationCount = (this.state.animationCount + 1) % this.state.totalStepCount

        const step = this.state.isForward
            ? animationCount
            : this.state.totalStepCount - animationCount

        const pose = getPose(this.state.walkSequence, step)
        this.onUpdate(pose)
        this.setState({ animationCount })
    }

    onUpdate = pose => {
        const hexapod = new VirtualHexapod(this.props.params.dimensions, pose)
        this.props.onUpdate(hexapod)
        this.setState({ pose })
    }

    setWalkSequence = (gaitParams, isTripodGait) => {
        const gaitType = isTripodGait ? "tripod" : "ripple"

        const walkSequence =
            getWalkSequence(this.props.params.dimensions, gaitParams, gaitType) ||
            this.state.walkSequence

        const totalStepCount = walkSequence["leftMiddle"].alpha.length

        const pose = getPose(walkSequence, this.state.animationCount)
        this.onUpdate(pose)
        this.setState({ gaitParams, walkSequence, totalStepCount })
    }

    updateGaitParams = (name, value) => {
        const gaitParams = { ...this.state.gaitParams, [name]: value }
        this.setWalkSequence(gaitParams, this.state.isTripodGait)
    }

    reset = () => {
        this.setState({ gaitParams: DEFAULT_GAIT_VARS })
        this.setWalkSequence(DEFAULT_GAIT_VARS, this.state.isTripodGait)
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

    twoSwitches = (switch1, switch2) => (
        <div className="row-container" style={{ padding: "10px" }}>
            <div className="cell">{switch1}</div>
            <div className="cell">{switch2}</div>
            <div className="cell"></div>
        </div>
    )

    render = () => (
        <Card title={<h2>{this.pageName}</h2>} other={this.animationCount}>
            {this.twoSwitches(this.animatingSwitch, this.widgetsSwitch)}

            <div hidden={!this.state.showGaitWidgets}>
                {this.twoSwitches(this.gaitTypeSwitch, this.directionSwitch)}
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
