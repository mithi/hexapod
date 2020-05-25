import React from "react"
import { BasicLink } from "../generic/SmallWidgets"

class LandingPage extends React.Component {
    pageName = "Root"
    // https://mithi.github.io/robotics-blog/v2-hexapod-1.gif
    componentDidMount() {
        this.props.onMount(this.pageName)
    }
    render = () => (
        <>
            <div className="hexapod-img" />
            <h2>Mithi's bare-minimum hexapod robot simulator.</h2>
            <p>
                It doesn't use any fancy libraries, only{" "}
                <BasicLink path="math.js" klass="text" symbol="Math.js" />
                for computations. Its only other dependencies are
                <BasicLink path="plotly.js" klass="text" symbol="Plotly.js" />
                for the 3d graph and
                <BasicLink path="react.js" klass="text" symbol="React.js" />
                for the user interface.
            </p>
            <p>
                With this app you can simulate common
                <BasicLink path="react.js" klass="text" symbol="gaits" />
                and solve for the{" "}
                <BasicLink path="react.js" klass="text" symbol="inverse" />
                and <BasicLink path="react.js" klass="text" symbol="forward" />{" "}
                kinematics. Here is a{" "}
                <BasicLink path="react.js" klass="text" symbol="demonstation view" />
                of this app in action.
            </p>
            <p>
                I'm also working on bare-minimum visualizations for stuff like
                Quadrupeds, Manipulators, Drones, Cars. If you like this, consider
                <BasicLink
                    path="react.js"
                    klass="text"
                    symbol="buying me a couple of cups of coffee 🍵"
                />
                to motivate me to make more cool stuff! You can also{" "}
                <BasicLink
                    path="react.js"
                    klass="text"
                    symbol="contribute to the source code"
                />{" "}
                or submit bug reports if you like.
            </p>
            <p>
                Love,{" "}
                <BasicLink path="react.js" klass="text" symbol="💖💕 M i t h i" />
            </p>
        </>
    )
}

export default LandingPage
