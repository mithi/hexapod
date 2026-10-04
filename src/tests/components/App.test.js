import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import App from "../../App"
import { PATH_LINKS, URL_LINKS } from "../../components/vars"

/* * * *
 Navigation Footer
 * * * */

const expectToHaveNav = () => {
    const roles = ["navigation", "contentinfo"]
    roles.map(role => expect(screen.getByRole(role)).toBeInTheDocument())

    const allLinks = [...PATH_LINKS, ...URL_LINKS]
    allLinks.forEach(link => {
        const node = screen.getByRole("link", { name: link.description })
        expect(node).toBeInTheDocument()
    })
}

/* * * *
Default Dimensions Widget
 * * * */

const expectToHaveDefaultDimensionsWidget = () => {
    const heading = screen.getByRole("heading", { name: "Dimensions" })
    expect(heading).toBeInTheDocument()

    const dimensions = {
        front: 60,
        middle: 60,
        side: 115,
        femur: 64.5,
        coxia: 64.5,
        tibia: 130.59,
    }
    const commonAttributes = [
        { key: "max", value: "Infinity" },
        { key: "min", value: "0" },
        { key: "step", value: "0.01" },
        { key: "type", value: "number" },
    ]

    Object.entries(dimensions).forEach(([name, value]) => {
        expect(screen.getByLabelText(name)).toBeInTheDocument()
        const node = screen.getByRole("spinbutton", { name })
        expect(node).toHaveAttribute("value", `${value}`)
        commonAttributes.forEach(attribute => {
            expect(node).toHaveAttribute(attribute.key, attribute.value)
        })
    })
}

/* * * *
Default Leg Patterns Page
 * * * */

const expectToHaveDefaultLegPatternsPage = () => {
    const heading = screen.getByRole("heading", { name: "Leg Patterns" })
    expect(heading).toBeInTheDocument()
    const sliderNames = ["alpha", "beta", "gamma"]

    sliderNames.forEach(name => {
        expect(screen.getByLabelText(name)).toBeInTheDocument()
        const node = screen.getByRole("slider", { name })
        expect(node).toHaveAttribute("value", "0")
        expect(node).toHaveAttribute("step", "0.01")
        expect(node).toHaveAttribute("type", "range")
    })
}

/* * * *
Default Inverse Kinematics Page
 * * * */

const expectToHaveDefaultInverseKinematics = () => {
    const heading = screen.getByRole("heading", { name: "Inverse Kinematics" })
    expect(heading).toBeInTheDocument()

    const attributes = [
        { key: "value", value: "0" },
        { key: "max", value: "1" },
        { key: "min", value: "-1" },
        { key: "step", value: "0.01" },
        { key: "type", value: "range" },
    ]

    const sliderTranslateNames = ["tx", "ty", "tz"]

    sliderTranslateNames.forEach(name => {
        expect(screen.getByLabelText(name)).toBeInTheDocument()
        const node = screen.getByRole("slider", { name })
        attributes.forEach(attribute => {
            expect(node).toHaveAttribute(attribute.key, attribute.value)
        })
    })

    const sliderRotateNames = ["rx", "ry", "rz", "hipStance", "legStance"]

    sliderRotateNames.forEach(name => {
        const node = screen.getByRole("slider", { name })
        expect(screen.getByLabelText(name)).toBeInTheDocument()
        expect(node).toHaveAttribute("value", "0")
        expect(node).toHaveAttribute("step", "0.01")
        expect(node).toHaveAttribute("type", "range")
    })
}

/* * * *
Default Forward Kinematics Page
 * * * */

const expectToHaveDefaultForwardKinematics = () => {
    const heading = screen.getByRole("heading", { name: "Forward Kinematics" })
    expect(heading).toBeInTheDocument()

    const angles = ["alpha", "beta", "gamma"]

    const legs = [
        "rightFront",
        "rightMiddle",
        "rightBack",
        "leftFront",
        "leftMiddle",
        "leftBack",
    ]

    for (const leg of legs) {
        for (const angle of angles) {
            const label = `${leg}-${angle}`
            const node = screen.getByRole((role, node) => {
                return role === "spinbutton" && node.getAttribute("id") === label
            })

            expect(node).toBeInTheDocument()
        }
    }
}

/* * * *
Elements all pages share
 * * * */

const expectEachPage = (
    flags = { numberOfResetButtons: 2, numberOfToggleSwitches: 1 }
) => {
    const resetButtons = screen.getAllByRole("button", { name: "reset" })
    const toggleSwitches = screen.getAllByRole("checkbox")
    expect(resetButtons).toHaveLength(flags.numberOfResetButtons)
    expect(toggleSwitches).toHaveLength(flags.numberOfToggleSwitches)
    expectToHaveDefaultDimensionsWidget()
    expectToHaveNav()
}

const click = name => fireEvent.click(screen.getByRole("link", { name }))

/* * * *
Application
 * * * */

describe("App", () => {
    beforeEach(() => {
        render(<App />)
    })

    test("Navigates to Leg Patterns page", () => {
        click("Leg Patterns")
        expectEachPage()
        expectToHaveDefaultLegPatternsPage()
    })

    test("Navigates to Inverse Kinematics page", () => {
        click("Inverse Kinematics")
        expectEachPage()
        expectToHaveDefaultInverseKinematics()
    })

    test("Navigates to Forward Kinematics page", () => {
        click("Forward Kinematics")
        expectEachPage({ numberOfResetButtons: 2, numberOfToggleSwitches: 2 })
        expectToHaveDefaultForwardKinematics()
    })

    test("Removes the old external support and source links", () => {
        expect(screen.queryByRole("link", { name: /ko-fi|source code/i })).toBeNull()
    })

    test("Navigates to Landing Page", () => {
        click("Home")
        const heading = screen.getByRole("heading", {
            name: "Hexapod Robot Simulator",
        })
        expect(heading).toBeInTheDocument()

        const wrongHeadings = [
            "Dimensions",
            "Leg Patterns",
            "Inverse Kinematics",
            "Forward Kinematics",
        ]
        wrongHeadings.forEach(name =>
            expect(screen.queryByRole("heading", { name })).toBeNull()
        )

        expectToHaveNav()
    })
})
