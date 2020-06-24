import React from "react"
import { render, screen, within } from "@testing-library/react"
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
        const { asFragment } = render(
            <DimensionsWidget params={{ dimensions: DIMENSIONS }} />
        )

        expect(asFragment()).toMatchSnapshot()

        expect(screen.getByRole("heading")).toHaveTextContent("Dimensions")
        expect(screen.getByRole("checkbox")).toBeInTheDocument()

        const button = screen.getByText("reset").closest("button")
        expect(button).toBeInTheDocument()

        Object.entries(DIMENSIONS).every(([name, value]) => {
            const attributes = {
                name,
                value,
                max: "Infinity",
                step: "1",
                min: "0",
                type: "number",
            }
            expect(screen.getByRole("spinbutton", attributes)).toBeInTheDocument()
            expect(screen.getByLabelText(name)).toBeInTheDocument()
        })
    })
})
