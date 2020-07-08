import React from "react"
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react"
import { HexapodPlot } from "../../components/HexapodPlot"

let PlotlyPromiseFactory = instruction => () => {
    return new Promise((resolve, reject) => {
        if (instruction.shouldFail) {
            return reject()
        }
        return resolve()
    })
}

test("HexapodPlot, retry when loading Plotly fails, ", async () => {
    let instruction = {
        shouldFail: true,
    }

    let promise = PlotlyPromiseFactory(instruction)

    render(
        <HexapodPlot
            data={[]}
            layout={[]}
            revision={1}
            onRelayout={() => {}}
            promise={promise}
        />
    )

    let retryBtn = await waitFor(() => screen.getByText(/Retry/i))
    expect(retryBtn).toBeInTheDocument()

    instruction.shouldFail = false

    act(() => {
        fireEvent.click(retryBtn)
    })

    let loadingMsg = await waitFor(() => screen.getByText(/Loading/i))

    expect(loadingMsg).toBeInTheDocument()

    let plot = await waitFor(() => screen.getByTestId("plot"))

    expect(plot).toBeInTheDocument()
})
