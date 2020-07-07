export const sleep = time => data =>
    new Promise(accept => setTimeout(() => accept(data), time))
