import React from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { render, screen } from "@testing-library/react"
import { NavDetailed, Nav } from "../../components/"
import { PATH_LINKS, URL_LINKS } from "../../components/vars"

describe("Navigation Components", () => {
    test("renders NavDetailed component correctly", () => {
        // prettier-ignore
        const { asFragment } = render(<Router><NavDetailed /></Router>)
        // prettier-ignore
        expect(asFragment(<Router><NavDetailed /></Router>)).toMatchSnapshot()

        const roles = ["navigation", "list", "contentinfo"]
        roles.map(role => expect(screen.getByRole(role)).toBeInTheDocument())

        expect(screen.getAllByRole("listitem")).toHaveLength(
            PATH_LINKS.length + URL_LINKS.length
        )

        const allLinks = [...PATH_LINKS, ...URL_LINKS]
        // prettier-ignore
        allLinks.map(link =>
            expect(screen.getByRole("link", { name: link.description }))
                .toBeInTheDocument()
        )
    })

    test("renders Nav correctly", () => {
        // prettier-ignore
        const { asFragment } = render(<Router><Nav /></Router>)
        // prettier-ignore
        expect(asFragment(<Router><NavDetailed /></Router>)).toMatchSnapshot()
    })
})
