import React from "react"
import ReactMarkdown from "react-markdown"
import { NavDetailed } from ".."
import { PageLink } from "../generic"

const landingPageMessage = `

# Mithi's Bare Minimum Hexapod Robot Simulator

Solve (and visualize) [forward][1] and [inverse][2] kinematics purely on your browser!
Built with [React][3], [Plotly][7], and [MathJS][4].
It's complete rewrite of the [one][6] I wrote in Python 🐍. Having
zero server-side computations (no round trip), it should be extremely fast!

I've been thinking of adding gaits and building more visualizers
for other robot configurations (drones, quadrupeds etc)
and robotics algorithms (mpc, ekf, etc).
Consider buying me a [couple cups of coffee 🍵 🍵 🍵][5] to help me get
motivated!

Algorithm optimizations, test additions, and bug fixes are welcome. [Submit an issue or pull request][6].
Any contribution (big or small) particularly on improving the
source code quality will be extremely appreciated. I only learned Javascript, css,
and React to make this project, so I'm not yet that familiar with all the 
best practices.

## Love, Mithi 💙

[1]: /forward-kinematics
[2]: /inverse-kinematics
[3]: https://reactjs.org/
[4]: https://mathjs.org/
[5]: https://ko-fi.com/minimithi
[6]: https://github.com/mithi/hexapod-robot-simulator
[7]: https://plot.ly/
`

class LandingPage extends React.Component {
    pageName = "Root"
    componentDidMount() {
        this.props.onMount(this.pageName)
    }

    render = () => (
        <>
            <PageLink path="./inverse-kinematics/">
                <div className="hexapod-img" />{" "}
            </PageLink>
            <div style={{ width: "100%" }}>
                <ReactMarkdown source={landingPageMessage} />
            </div>
            <NavDetailed />
        </>
    )
}

export default LandingPage
