import React from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { render } from "@testing-library/react"
import { NavDetailed, Nav } from "../../components/"

describe("Navigation Components", () => {
    test("renders NavDetailed component correctly", () => {
        // prettier-ignore
        const { asFragment } = render(<Router><NavDetailed /></Router>)
        // prettier-ignore
        expect(asFragment(<Router><NavDetailed /></Router>)).toMatchSnapshot()
    })

    test("renders Nav correctly", () => {
        // prettier-ignore
        const { asFragment } = render(<Router><Nav /></Router>)
        // prettier-ignore
        expect(asFragment(<Router><NavDetailed /></Router>)).toMatchSnapshot()
    })
})
