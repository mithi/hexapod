import React, { Component } from "react"
import { sliderList, Card, BasicButton, ToggleSwitch } from "../generic"
import { SECTION_NAMES, RESET_LABEL } from "../vars"
import getWalkSequence from "../../hexapod/solvers/walkSequenceSolver"
import { PoseTable } from ".."

const SLIDER_LABELS = [
    "tz",
    "tx",
    "legStance",
    "rx",
    "ry",
    "hipStance",
    "hipSwing",
    "stepCount",
    "liftSwing",
]

const PARAMS = {
    tx: { minVal: -0.25, maxVal: 0.25, stepVal: 0.01, defaultVal: 0 },
    tz: { minVal: -0.5, maxVal: 0.5, stepVal: 0.01, defaultVal: 0 },
    rx: { minVal: -15, maxVal: 15, stepVal: 0.5, defaultVal: 0 },
    ry: { minVal: -15, maxVal: 15, stepVal: 0.5, defaultVal: 0 },
    legStance: { minVal: -50, maxVal: 50, stepVal: 0.5, defaultVal: 0 },
    hipStance: { minVal: 20, maxVal: 40, stepVal: 0.5, defaultVal: 20 },
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

class WalkingGaitsPage extends Component {
    pageName = SECTION_NAMES.walkingGaits
    state = {
        gaitParams: DEFAULT_GAIT_VARS,
        isAnimating: false,
        animationCount: 0,
        totalStepCount: 0,
        isForward: true,
        showGaitWidgets: true,
    }

    componentDidMount() {
        this.props.onMount(this.pageName)
        this.setWalkSequence(DEFAULT_GAIT_VARS)
    }

    componentWillUnmount() {
        this.stopAnimation()
    }

    toggleAnimating = () => {
        const isAnimating = !this.state.isAnimating

        isAnimating ? this.startAnimation() : this.stopAnimation()
        this.setState({ isAnimating })
    }

    toggleDirection = () => {
        this.setState({ isForward: !this.state.isForward })
    }

    toggleWidgets = () => {
        this.setState({ showGaitWidgets: !this.state.showGaitWidgets })
    }

    startAnimation = () => {
        this.intervalID = setInterval(this.animate, 1)
    }

    stopAnimation = () => {
        clearInterval(this.intervalID)
    }

    animate = () => {
        const animationCount = (this.state.animationCount + 1) % this.state.totalStepCount

        const step = this.state.isForward
            ? animationCount
            : this.state.totalStepCount - animationCount

        const pose = getPose(this.state.walkSequence, step)
        this.props.onUpdate(pose)
        this.setState({ animationCount, pose })
    }

    setWalkSequence = gaitParams => {
        const walkSequence =
            getWalkSequence(this.props.params.dimensions, gaitParams) ||
            this.state.walkSequence

        const totalStepCount = walkSequence["leftMiddle"].alpha.length

        const pose = getPose(walkSequence, this.state.animationCount)
        this.props.onUpdate(pose)
        this.setState({ gaitParams, walkSequence, totalStepCount, pose })
    }

    updateGaitParams = (name, value) => {
        const gaitParams = { ...this.state.gaitParams, [name]: value }
        this.setWalkSequence(gaitParams)
    }

    reset = () => {
        this.setState({ gaitParams: DEFAULT_GAIT_VARS })
        this.setWalkSequence(DEFAULT_GAIT_VARS)
    }

    get widgetsSwitch() {
        return (
            <ToggleSwitch
                id="gaitWidgetSwitch"
                value={this.state.showGaitWidgets ? "controls shown" : "pose shown"}
                handleChange={this.toggleWidgets}
                showValue={true}
            />
        )
    }

    get animatingSwitch() {
        return (
            <div className="row-container flex-wrap">
                <p>Animate:</p>
                <ToggleSwitch
                    id="IsAnimatingSwitch"
                    value={this.state.isAnimating ? "PLAYING..." : "PAUSED."}
                    handleChange={this.toggleAnimating}
                    showValue={true}
                />
                <p> {this.state.isAnimating ? this.state.animationCount : null} </p>
            </div>
        )
    }

    get directionSwitch() {
        return (
            <ToggleSwitch
                id="walkDirectionSwitch"
                value={this.state.isForward ? "going forward." : "going backward."}
                handleChange={this.toggleDirection}
                showValue={true}
            />
        )
    }

    get sliders() {
        return sliderList({
            names: SLIDER_LABELS,
            values: this.state.gaitParams,
            rangeParams: PARAMS,
            handleChange: this.updateGaitParams,
        })
    }

    get gaitWidgets() {
        const sliders = this.sliders
        return (
            <>
                <div className="row-container flex-wrap">
                    <p> Motion Parameters </p>
                    {this.directionSwitch}
                </div>
                <div className="row-container">{sliders.slice(6, 9)}</div>
                <p>Orientation Parameters</p>
                <div className="row-container">{sliders.slice(0, 3)}</div>
                <div className="row-container">{sliders.slice(3, 6)}</div>
                <br />
                <BasicButton handleClick={this.reset}>{RESET_LABEL}</BasicButton>
            </>
        )
    }

    get header() {
        return (
            <div className="row-container flex-wrap">
                <h2>{this.pageName}</h2>
                {this.widgetsSwitch}
            </div>
        )
    }

    render = () => {
        return (
            <Card title={this.header} h="div">
                {this.animatingSwitch}
                {this.state.showGaitWidgets ? (
                    this.gaitWidgets
                ) : (
                    <PoseTable pose={this.state.pose} />
                )}
            </Card>
        )
    }
}

export default WalkingGaitsPage
