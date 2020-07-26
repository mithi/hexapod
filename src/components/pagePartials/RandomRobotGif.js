import React, { Suspense } from "react"

const MinimumRandomRobotGif = React.lazy(() => import("./MinimumRandomRobotGif"))

const RandomRobotGif = () => (
    <div style={{ height: "80px" }}>
        <Suspense fallback={<p>A cute random robot will soon appear!</p>}>
            <MinimumRandomRobotGif />
        </Suspense>
    </div>
)

export default RandomRobotGif
