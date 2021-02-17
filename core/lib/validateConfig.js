import exampleConfig from '../deploya.config.example.js'

export default function (config) {
    const exampleKeys = Object.keys(exampleConfig)
    const providedKeys = Object.keys(config)
    const missingKeys = []
    exampleKeys.forEach(exampleKey => providedKeys.includes(exampleKey) ? null : missingKeys.push(exampleKey))
    return missingKeys.length > 0 ? new Error(`Config is missing attributes: ${missingKeys.map((key, i) => ` "${key}"`)}`) : null
}