import React from "react"
import { render } from "@testing-library/react"
import App from "../../components/"

describe("App", () => {
    test("renders App component", () => {
        render(<App />)
    })
})
