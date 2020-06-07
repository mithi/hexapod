import React from "react"
import ReactMarkdown from "react-markdown"
import { NavDetailed } from ".."
import { PageLink } from "../generic"

const landingPageMessage = `

# Mithi's Bare Minimum Hexapod Robot Simulator

Solve (and visualize) [forward][1] and [inverse][2] kinematics purely on your browser!
Built with [React][3], [Plotly][7], and [MathJS][4].
This is a complete rewrite of the [original][6] one I wrote in Python 🐍. Since
this has zero server-side computations (which means no round trip) it should be extremely fast!

I've been thinking of adding gait simulators and building more visualizers
for other types of robot configurations (arms, drones, quadrupeds, and cars)
and other robotics algorithms (model predictive control, kalman filters, path planning etc).
Consider buying me a [couple cups of coffee 🍵 🍵 🍵][5] to help me get
motivated!

If you have ideas on how to make the source code quality better, I'd love to hear it! 💙
I only learned Javascript, css, and React to make this project,
so I'm not yet that familiar with best practices. Algorithm optimizations, test additions,
and bug fixes (big or small) would also be extremely appreciated. [Submit an issue or pull request][6].

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
            <ReactMarkdown source={landingPageMessage} />
            <NavDetailed />
        </>
    )
}

export default LandingPage
