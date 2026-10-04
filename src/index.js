import React, { Suspense } from "react"
import ReactDOM from "react-dom"
import "./index.css"
//import "./font.css"
import * as serviceWorker from "./serviceWorker"

const App = React.lazy(() =>
    import(/* webpackChunkName: "APP", webpackPreload: true */ "./App")
)

ReactDOM.render(
    <React.StrictMode>
        <Suspense fallback={<p>Loading Hexapod Robot Simulator...</p>}>
            <App />
        </Suspense>
    </React.StrictMode>,
    document.getElementById("root")
)

// Disable the upstream offline cache so Netlify deployments update immediately.
serviceWorker.unregister()
