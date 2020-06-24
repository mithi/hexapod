import React from "react"
import { render, screen} from "@testing-library/react"
import App from "../../App"

describe("App", () => {
    test("renders App component", () => {
        render(<App />)
        screen.debug()
    })
})

/*

Nav
NavDetailed
Sliders
Posetable
DimensionsWidget
InverseKinematicsPage
ForwardKinematicsPage
LagPatternsPage
LandingPage
AlertBox
*/