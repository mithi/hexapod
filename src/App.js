import React from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { DEFAULT_POSE } from "./templates"
import { SECTION_NAMES } from "./components/vars"
import { Nav, NavDetailed, DimensionsWidget } from "./components"
import { updateHexapod, Page } from "./AppHelpers"
import HexapodPlot from "./components/HexapodPlot"

window.dataLayer = window.dataLayer || []
function gtag() {
    window.dataLayer.push(arguments)
}

class App extends React.Component {
    state = {
        inHexapodPage: false,
        hexapod: updateHexapod("default"),
        revision: 0,
    }

    /* * * * * * * * * * * * * *
     * Page load Callback
     * * * * * * * * * * * * * */

    onPageLoad = pageName => {
        document.title = pageName + " - Mithi's Bare Minimum Hexapod Robot Simulator"
        gtag("config", "UA-170794768-1", {
            page_path: window.location.pathname + window.location.search,
        })

        if (pageName === SECTION_NAMES.landingPage) {
            this.setState({ inHexapodPage: false })
            return
        }

        this.setState({ inHexapodPage: true })
        this.manageState("pose", { pose: DEFAULT_POSE })
    }

    /* * * * * * * * * * * * * *
     * State Management Callback
     * * * * * * * * * * * * * */

    manageState = (updateType, newParam) => {
        const hexapod = updateHexapod(updateType, newParam, this.state.hexapod)

        this.setState({
            revision: this.state.revision + 1,
            hexapod,
        })
    }
    /* * * * * * * * * * * * * *
     * Page Component Prototype
     * * * * * * * * * * * * * */

    pageComponent = Component => (
        <Component
            onMount={this.onPageLoad}
            onUpdate={this.manageState}
            params={{
                dimensions: this.state.hexapod.dimensions,
                pose: this.state.hexapod.pose,
            }}
        />
    )

    /* * * * * * * * * * * * * *
     * Layout
     * * * * * * * * * * * * * */

    render = () => (
        <Router>
            <Nav />
            <div id="main">
                <div id="sidebar">
                    <div hidden={!this.state.inHexapodPage}>
                        <DimensionsWidget
                            params={{ dimensions: this.state.hexapod.dimensions }}
                            onUpdate={this.manageState}
                        />
                    </div>
                    <Page pageComponent={this.pageComponent} />
                    {!this.state.inHexapodPage ? <NavDetailed /> : null}
                </div>
                <div id="plot" className="border" hidden={!this.state.inHexapodPage}>
                    <HexapodPlot
                        revision={this.state.revision}
                        hexapod={this.state.hexapod}
                    />
                </div>
            </div>
            {this.state.inHexapodPage ? <NavDetailed /> : null}
        </Router>
    )
}

export default App
