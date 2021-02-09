import exampleConfig from '../dpa.config.example.json'

export default function (config) {
    const exampleKeys = Object.keys(exampleConfig)
    const providedKeys = Object.keys(config)
    const missingKeys = []
    exampleKeys.forEach(exampleKey => providedKeys.includes(exampleKey) ? null : missingKeys.push(exampleKey))
    return missingKeys.length > 0 ? new Error(`DPA config is missing attributes: ${missingKeys.map((key, i) => ` "${key}"`)}`) : null
}