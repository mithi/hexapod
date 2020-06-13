import React from "react"
import ReactMarkdown from "react-markdown"
import { NavDetailed } from ".."
import { PageLink } from "../generic"

const landingPageMessage = `

# Mithi's Bare Minimum Hexapod Robot Simulator

- Solve (and visualize) [forward][1] and [inverse][2] kinematics purely on your browser!
It's a complete rewrite of the [one][3] I wrote in Python 🐍.
No more server-side computations!

- Consider buying me a [couple cups of coffee 🍵 🍵 🍵][4] to motivate me
to build other robotics related visualizers. (Quadrotors?!)

- Any contribution to improve the source code will be extremely appreciated. 💙
Anything from fixing typographical errors to completely changing the page design ... or even rewriting
modules to follow better software practices. [How you can help][5].

## Love, Mithi

[1]: /forward-kinematics
[2]: /inverse-kinematics
[3]: https://github.com/mithi/hexapod-robot-simulator
[4]: https://ko-fi.com/minimithi
[5]: https://github.com/mithi/hexapod/wiki/Types-of-(code)-Contributions

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
            <div id="landing">
                <ReactMarkdown source={landingPageMessage} />
            </div>
            <NavDetailed />
        </>
    )
}

export default LandingPage
