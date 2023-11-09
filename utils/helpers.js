const randomize = (num, deep = 1) => {
    const random = Math.random() * deep
    return num - deep + random
}

const averageData = (arr) => {
    const [first, ...rest] = arr
    // handle if the array is only one element
    if (rest.length === 0) return { first, average: first.value }
    const average = rest.reduce((acc, curr) => acc + curr.value, 0) / rest.length
    return { first, average }
}

export {
    randomize,
    averageData,
}