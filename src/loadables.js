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

export function SuspenseLandingPage(props) {
    return (
        <Suspense fallback={null}>
            <LazyLanding {...props} />
        </Suspense>
    )
}

export function SuspenseForwardKinematicsPage(props) {
    return (
        <Suspense fallback={null}>
            <LazyForwardKinematicsPage {...props} />
        </Suspense>
    )
}

export function SuspenseInverseKinematicsPage(props) {
    return (
        <Suspense fallback={null}>
            <LazyInverseKinematicsPage {...props} />
        </Suspense>
    )
}

export function SuspenseLegPatternPage(props) {
    return (
        <Suspense fallback={null}>
            <LazyLegPatternPage {...props} />
        </Suspense>
    )
}
