import React from "react"
import ReactMarkdown from "react-markdown"
import { POSITION_NAMES_LIST } from "../hexapod"

const POSITION_ALIAS = {
    rightMiddle: "rm",
    rightFront: "rf",
    leftFront: "lf",
    leftMiddle: "lm",
    leftBack: "lb",
    rightBack: "rb",
}

const formatPose = pose =>
    POSITION_NAMES_LIST.reduce((formattedPose, position) => {
        const alias = POSITION_ALIAS[position]
        const { alpha, beta, gamma } = pose[position]
        formattedPose[alias] = {
            alpha: Number(alpha).toFixed(2),
            beta: Number(beta).toFixed(2),
            gamma: Number(gamma).toFixed(2),
        }
        return formattedPose
    }, {})

const poseMessage = ({ rm, rf, lf, lm, lb, rb }) => `

| POSITION    | ALPHA       | BETA        | GAMMA       |
|-------------|:-----------:|:-----------:|:-----------:|
| rightMiddle | ${rm.alpha} | ${rm.beta}  | ${rm.gamma} |
| rightFront  | ${rf.alpha} | ${rf.beta}  | ${rf.gamma} |
| leftFront   | ${lf.alpha} | ${lf.beta}  | ${lf.gamma} |
| leftMiddle  | ${lm.alpha} | ${lm.beta}  | ${lm.gamma} |
| leftBack    | ${lb.alpha} | ${lb.beta}  | ${lb.gamma} |
| rightBack   | ${rb.alpha} | ${rb.beta}  | ${rb.gamma} |

`

const poseTable = ({ pose }) => {
    const formattedPose = formatPose(pose)
    const { rm, rf, lf, lm, lb, rb } = formattedPose
    const markdownMessage = poseMessage({ rm, rf, lf, lm, lb, rb })
    return (
        <div className="table-container">
            <div className="cell" style={{}}>
                <ReactMarkdown source={markdownMessage} />
            </div>
        </div>
    )
}

export default poseTable
