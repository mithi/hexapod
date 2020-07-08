import { sleep } from "../utils"

test("sleep a promise chain passing through data", () => {
    const data = { msg: "I am msg", done: false }

    return Promise.resolve(data)
        .then(sleep(500))
        .then(resp => {
            expect(resp).toBe(data)
        })
})
