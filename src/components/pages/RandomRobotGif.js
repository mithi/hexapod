import React from "react"

const getImageUrl = () =>
    Math.random() > 0.5 ? "./img/small-robot-small.gif" : "./img/small-robot-2-small.gif"

const RandomRobotGif = () => (
    <img
        loading="lazy"
        src={getImageUrl()}
        alt="hexapod robot animation"
        height="75"
        style={{ marginTop: "20px", borderRadius: "20px" }}
    />
)

export default RandomRobotGif
