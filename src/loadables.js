import React, { lazy, Suspense } from "react"

const LazyLanding = lazy(() =>
    import(
        /* webpackChunkName: "Landing", webpackPreload: true */ "./components/pages/LandingPage"
    )
)

const LazyForwardKinematicsPage = lazy(() =>
    import(
        /* webpackChunkName: "FwdKinematics", webpackPrefetch: true */ "./components/pages/ForwardKinematicsPage"
    )
)

const LazyInverseKinematicsPage = lazy(() =>
    import(
        /* webpackChunkName: "InvKinematics", webpackPrefetch: true */ "./components/pages/InverseKinematicsPage"
    )
)

const LazyLegPatternPage = lazy(() =>
    import(
        /* webpackChunkName: "LegPattern", webpackPrefetch: true */ "./components/pages/LegPatternPage"
    )
)

const LazyHexapodPlot = lazy(() =>
    import(
        /* webpackChunkName: "Hexapod", webpackPrefetch: true */ "./components/HexapodPlot"
    )
)

const Fallback = () => null

export function SuspenseLandingPage(props) {
    return (
        <Suspense fallback={<Fallback />}>
            <LazyLanding {...props} />
        </Suspense>
    )
}

export function SuspenseForwardKinematicsPage(props) {
    return (
        <Suspense fallback={<Fallback />}>
            <LazyForwardKinematicsPage {...props} />
        </Suspense>
    )
}

export function SuspenseInverseKinematicsPage(props) {
    return (
        <Suspense fallback={<Fallback />}>
            <LazyInverseKinematicsPage {...props} />
        </Suspense>
    )
}

export function SuspenseLegPatternPage(props) {
    return (
        <Suspense fallback={<Fallback />}>
            <LazyLegPatternPage {...props} />
        </Suspense>
    )
}

export function SuspenseHexapodPlot(props) {
    return (
        <Suspense fallback={<Fallback />}>
            <LazyHexapodPlot {...props} />
        </Suspense>
    )
}
