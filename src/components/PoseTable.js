import React from "react"
import { withHexapodParams } from "./providers/HexapodParams"

const TableHeader = React.memo(({ labels }) => (
    <thead>
        <tr>
            {labels.map(label => (
                <th key={label}>{label}</th>
            ))}
        </tr>
    </thead>
))

const TableRow = React.memo(({ label, alpha, beta, gamma }) => (
    <tr>
        <td>{label}</td>
        <td>{Number(alpha).toFixed(2)}</td>
        <td>{Number(beta).toFixed(2)}</td>
        <td>{Number(gamma).toFixed(2)}</td>
    </tr>
))

const PoseTable = ({ pose, showPoseTable }) => {
    if (!showPoseTable) return null
    const { rightMiddle, rightFront, leftFront, leftMiddle, leftBack, rightBack } = pose
    return (
        <div className="table-container">
            <div className="cell">
                <table>
                    <TableHeader labels={["POSITION", "ALPHA", "BETA", "GAMMA"]} />
                    <tbody>
                        <TableRow label="rightMiddle" {...rightMiddle} />
                        <TableRow label="rightFront" {...rightFront} />
                        <TableRow label="leftFront" {...leftFront} />
                        <TableRow label="leftMiddle" {...leftMiddle} />
                        <TableRow label="leftBack" {...leftBack} />
                        <TableRow label="rightBack" {...rightBack} />
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default withHexapodParams(PoseTable, ({ pose }) => ({ pose }))
