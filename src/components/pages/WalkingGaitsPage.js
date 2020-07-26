import React, { Component } from "react"
import { sliderList, Card, ResetButton, ToggleSwitch } from "../generic"
import { SECTION_NAMES, GAIT_SLIDER_LABELS, GAIT_RANGE_PARAMS } from "../vars"
import getWalkSequence from "../../hexapod/solvers/walkSequenceSolver"
import PoseTable from "../pagePartials/PoseTable"
import { VirtualHexapod } from "../../hexapod"
import { tRotZmatrix } from "../../hexapod/geometry"
import { DEFAULT_GAIT_PARAMS } from "../../templates"

const ANIMATION_DELAY = 25

const getPose = (sequences, i) => {
    return Object.keys(sequences).reduce((newSequences, legPosition) => {
        const { alpha, beta, gamma } = sequences[legPosition]
        newSequences[legPosition] = { alpha: alpha[i], beta: beta[i], gamma: gamma[i] }
        return newSequences
    }, {})
}

const newSwitch = (id, value, handleChange) => (
    <ToggleSwitch id={id} handleChange={handleChange} value={value} showValue={true} />
)

const switches = (switch1, switch2, switch3) => (
    <div className="grid-cols-3" style={{ paddingBottom: "20px" }}>
        {switch1}
        {switch2}
        {switch3}
    </div>
)

const countSteps = sequence => sequence["leftMiddle"].alpha.length

class WalkingGaitsPage extends Component {
    pageName = SECTION_NAMES.walkingGaits
    currentTwist = 0
    walkSequence = null
    state = {
        gaitParams: DEFAULT_GAIT_PARAMS,
        isAnimating: false,
        isTripodGait: true,
        isForward: true,
        inWalkMode: true,
        showGaitWidgets: true,
        animationCount: 0,
    }

    componentDidMount = () => {
        this.props.onMount(this.pageName)
        const { isTripodGait, inWalkMode } = this.state
        this.setWalkSequence(DEFAULT_GAIT_PARAMS, isTripodGait, inWalkMode)
    }

    componentWillUnmount = () => {
        clearInterval(this.intervalID)
    }

    animate = () => {
        const { isForward, inWalkMode } = this.state

        const stepCount = countSteps(this.walkSequence)
        const animationCount = (this.state.animationCount + 1) % stepCount
        this.setState({ animationCount })

        const tempStep = isForward ? animationCount : stepCount - animationCount
        const step = Math.max(0, Math.min(stepCount - 1, tempStep))

        const pose = getPose(this.walkSequence, step)

        if (inWalkMode) {
            this.onUpdate(pose, this.currentTwist)
            return
        }

        const deltaTwist = (this.state.gaitParams.hipSwing * 2) / stepCount
        const twist = isForward
            ? (this.currentTwist + deltaTwist) % 360
            : (this.currentTwist - deltaTwist) % 360

        this.onUpdate(pose, twist)
    }

    onUpdate = (pose, currentTwist) => {
        this.currentTwist = currentTwist

        const { dimensions } = this.props.params
        const hexapod = new VirtualHexapod(dimensions, pose, { wontRotate: true })

        // ❗❗️HACK When we've passed undefined pose values for some reason
        if (!hexapod || !hexapod.body) {
            return
        }

        const matrix = tRotZmatrix(currentTwist)
        this.props.onUpdate("hexapod", { hexapod: hexapod.cloneTrot(matrix) })
    }

    setWalkSequence = (gaitParams, isTripodGait, inWalkMode) => {
        const gaitType = isTripodGait ? "tripod" : "ripple"
        const walkMode = inWalkMode ? "walking" : "rotating"

        const { dimensions } = this.props.params
        const { animationCount } = this.state

        this.walkSequence =
            getWalkSequence(dimensions, gaitParams, gaitType, walkMode) ||
            this.walkSequence

        const pose = getPose(this.walkSequence, animationCount)
        this.onUpdate(pose, this.currentTwist)
        this.setState({ gaitParams, isTripodGait, inWalkMode })
    }

    reset = () => {
        const { isTripodGait, inWalkMode } = this.state
        this.currentTwist = 0
        this.setWalkSequence(DEFAULT_GAIT_PARAMS, isTripodGait, inWalkMode)
    }

    updateGaitParams = (name, value) => {
        const { isTripodGait, inWalkMode } = this.state
        const gaitParams = { ...this.state.gaitParams, [name]: value }
        this.setWalkSequence(gaitParams, isTripodGait, inWalkMode)
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

    toggleWidgets = () => this.setState({ showGaitWidgets: !this.state.showGaitWidgets })

    toggleDirection = () => this.setState({ isForward: !this.state.isForward })

    toggleAnimating = () => {
        const isAnimating = !this.state.isAnimating
        this.setState({ isAnimating })

        if (isAnimating) {
            this.intervalID = setInterval(this.animate, ANIMATION_DELAY)
        } else {
            clearInterval(this.intervalID)
        }
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
            names: GAIT_SLIDER_LABELS,
            values: this.state.gaitParams,
            rangeParams: GAIT_RANGE_PARAMS,
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

    render() {
        const animationControlSwitches = switches(
            this.animatingSwitch,
            this.widgetsSwitch
        )
        const gaitControlSwitches = switches(
            this.gaitTypeSwitch,
            this.directionSwitch,
            this.rotateSwitch
        )

        const { showGaitWidgets } = this.state
        const { pose } = this.props.params

        return (
            <Card title={<h2>{this.pageName}</h2>} other={this.animationCount}>
                {animationControlSwitches}

                <div hidden={!showGaitWidgets}>
                    {gaitControlSwitches}
                    {this.sliders}
                    <ResetButton reset={this.reset} />
                </div>

                <div hidden={showGaitWidgets}>
                    <PoseTable pose={pose} />
                </div>
            </Card>
        )
    }
}

export default WalkingGaitsPage
