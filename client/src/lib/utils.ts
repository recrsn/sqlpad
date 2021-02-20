export function randomId(prefix = "cell_") {
    return prefix + Date.now().toString(36)
}
