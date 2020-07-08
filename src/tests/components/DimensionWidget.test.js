import React from "react"
import { render, screen } from "@testing-library/react"
import { DimensionsWidget } from "../../components"

const DIMENSIONS = {
    front: 71,
    side: 102,
    middle: 133,
    coxia: 94,
    femur: 165,
    tibia: 154,
}

describe("Dimension Widget", () => {
    test("renders component correctly", () => {
        render(<DimensionsWidget params={{ dimensions: DIMENSIONS }} />)
        expect(screen.getByRole("heading")).toHaveTextContent("Dimensions")
        expect(screen.getByRole("checkbox")).toBeInTheDocument()

        const button = screen.getByRole("button", { name: "reset" })
        expect(button).toBeInTheDocument()

        Object.entries(DIMENSIONS).forEach(([name, value]) => {
            const node = screen.getByRole("spinbutton", { name })
            expect(node).toHaveAttribute("value", `${value}`)
            expect(screen.getByLabelText(name)).toBeInTheDocument()
        })
    })
})
