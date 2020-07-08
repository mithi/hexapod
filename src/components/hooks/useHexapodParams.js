import { useCallback, useReducer } from "react"
import ReactGA from "react-ga"
import * as defaults from "../../templates"

ReactGA.initialize("UA-170794768-1", {
    //debug: true,
    //testMode: process.env.NODE_ENV === 'test',
    gaOptions: { siteSpeedSampleRate: 100 },
})

const merge = (prev, next) => ({ ...prev, ...next })

export const useHexapodParams = () => {
    const [hexapodParams, setHexaPod] = useReducer(merge, {
        dimensions: defaults.DEFAULT_DIMENSIONS,
        pose: defaults.DEFAULT_POSE,
    })

    /* * * * * * * * * * * * * *
     * Every time the hexapod changes, update the plot!
     * * * * * * * * * * * * * */

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

    return { hexapodParams, onPageLoad, updateHexapod, updatePose, updateDimensions }
}
