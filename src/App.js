import React, { useEffect } from "react"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import { VirtualHexapod } from "./hexapod"
import { PATH_LINKS } from "./components/vars"
import { Nav } from "./components"

import Routes from "./routes"
import { HandlersProvider } from "./components/providers/Handlers"
import { HexapodParamsProvider } from "./components/providers/HexapodParams"

import { useHexapodParams } from "./components/hooks/useHexapodParams"
import { usePlot } from "./components/hooks/usePlot"

function App() {
    const { hexapodParams, ...handlers } = useHexapodParams()
    const { plot, updatePlotWithHexapod, logCameraView } = usePlot()

    useEffect(() => {
        const hexapod = new VirtualHexapod(hexapodParams.dimensions, hexapodParams.pose)
        updatePlotWithHexapod(hexapod)
    }, [hexapodParams, updatePlotWithHexapod])

    return (
        <Router>
            <Nav />
            <Switch>
                <Route path={PATH_LINKS.map(({ path }) => path)} exact>
                    <HexapodParamsProvider {...hexapodParams}>
                        <HandlersProvider {...handlers}>
                            <Routes {...plot} onRelayout={logCameraView} />
                        </HandlersProvider>
                    </HexapodParamsProvider>
                </Route>
                <Route>
                    <Redirect to="/" />
                </Route>
            </Switch>
        </Router>
    )
}

export default App
