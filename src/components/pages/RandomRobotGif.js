import React, { Suspense } from "react"

const MinimumRandomRobotGif = React.lazy(() => import("./MinimumRandomRobotGif"))

const RandomRobotGif = () => {
    return (
        <Suspense fallback={<p>A cute random robot will soon appear!</p>}>
            <MinimumRandomRobotGif />
        </Suspense>
    )
}

export default RandomRobotGif
