import React, { useCallback, useReducer, useEffect, useRef } from "react"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import ReactGA from "react-ga"
import { VirtualHexapod, getNewPlotParams } from "./hexapod"
import * as defaults from "./templates"
import { PATH_LINKS } from "./components/vars"
import { Nav } from "./components"

import Routes from "./routes"
import { HandlersProvider } from "./components/providers/Handlers"
import { HexapodParamsProvider } from "./components/providers/HexapodParams"

ReactGA.initialize("UA-170794768-1", {
    //debug: true,
    //testMode: process.env.NODE_ENV === 'test',
    gaOptions: { siteSpeedSampleRate: 100 },
})

const merge = (prev, next) => ({ ...prev, ...next })
const mergeWithCounter = (prev, next) => ({
    ...merge(prev, next),
    counter: prev.counter + 1,
})

function App() {
    const [hexapodParams, setHexaPod] = useReducer(merge, {
        dimensions: defaults.DEFAULT_DIMENSIONS,
        pose: defaults.DEFAULT_POSE,
    })

    const [plot, setPlot] = useReducer(mergeWithCounter, {
        data: defaults.DATA,
        layout: defaults.LAYOUT,
        counter: 0,
    })

    const cameraView = useRef()
    cameraView.current = defaults.CAMERA_VIEW

    /* * * * * * * * * * * * * *
     * Handle plot update
     * * * * * * * * * * * * * */

    const updatePlotWithHexapod = useCallback(hexapod => {
        if (hexapod === null || hexapod === undefined || !hexapod.foundSolution) {
            return
        }

        const [data, layout] = getNewPlotParams(hexapod, cameraView.current)

        return setPlot({
            data,
            layout,
        })
    }, [])

    /* * * * * * * * * * * * * *
     * Every time the hexapod changes, update the plot!
     * * * * * * * * * * * * * */
    useEffect(() => {
        const hexapod = new VirtualHexapod(hexapodParams.dimensions, hexapodParams.pose)
        updatePlotWithHexapod(hexapod)
    }, [hexapodParams, updatePlotWithHexapod])

    const logCameraView = useCallback(relayoutData => {
        cameraView.current = relayoutData["scene.camera"] ?? defaults.CAMERA_VIEW
    }, [])

    const updateDimensions = useCallback(dimensions => setHexaPod({ dimensions }), [
        setHexaPod,
    ])

    const updatePose = useCallback(pose => setHexaPod({ pose }), [setHexaPod])

    const updateHexapod = useCallback(
        hexapod => {
            // bail-out if nothing comes through
            if (hexapod) setHexaPod(hexapod)
        },
        [setHexaPod]
    )

    /* * * * * * * * * * * * * *
     * Handle page load
     * * * * * * * * * * * * * */

    const onPageLoad = useCallback(() => {
        ReactGA.pageview(window.location.pathname + window.location.search)

        return setHexaPod({
            pose: defaults.DEFAULT_POSE,
        })
    }, [setHexaPod])

    /* * * * * * * * * * * * * *
     * Layout
     * * * * * * * * * * * * * */

    return (
        <Router>
            <Nav />
            <Switch>
                <Route path={PATH_LINKS.map(({ path }) => path)} exact>
                    <HexapodParamsProvider {...hexapodParams}>
                        <HandlersProvider
                            onPageLoad={onPageLoad}
                            updatePose={updatePose}
                            updateHexapod={updateHexapod}
                            updateDimensions={updateDimensions}
                        >
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
