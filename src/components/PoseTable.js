import React from "react"
import ReactMarkdown from "react-markdown"

const poseMessage = `

| POSITION    | ALPHA       | BETA        | GAMMA       |
|-------------|:-----------:|:-----------:|:-----------:|
| rightMiddle | -180.21     | +145.00     | -134.50     |
| rightFront  | 180.21      | 45.00       | -34.50      |
| leftFront   | 180.21      | 45.00       | -34.50      |
| leftMiddle  | 180.21      | 45.00       | -34.50      |
| leftBack    | 180.21      | 45.00       | -34.50      |
| rightBack   | 180.21      | 45.00       | -34.50      |

`
const poseTable = () => {
    return (
        <div className="table-container">
            <div className="cell" style={{}}>
                <ReactMarkdown source={poseMessage} />
            </div>
        </div>
    )
}

export default poseTable
