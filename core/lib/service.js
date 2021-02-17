import validateConfig from './validateConfig.js'
import Adapter from './adapter.js'
import services from '../supported.services.js'

export default async function (config) {
    console.log("Starting deployment with Deploya...")

    console.log("validating deploya.config.json...")
    // initial validatation of provided config (this could be done with types)
    const configStatus = validateConfig(config)
    if (configStatus) return console.log(configStatus)

    // verify provided platform and service are supported
    const platform = config.platform.toLowerCase()
    const service = config.service.toLowerCase()
    console.log(`target platform: ${platform}`)
    console.log(`target service: ${service}`)

    let missing = !services.hasOwnProperty(platform) ? "platform" : 
        !services[platform].hasOwnProperty(service) || !services[platform][service] ? "service" : null
    if (missing) return console.log(new Error(`
        Target ${missing} not supported. \n
        Please see https://github.com/sebringrose/deploya \nfor supported platforms and services.
    `))
    
    // import and run target adapter class with config
    let modulePath = `${process.cwd()}/node_modules/@deploya/${platform}-${service}/index.js`
    import(modulePath)
        .then(service => new Adapter(service.default).deploy(config))
        .then(result => console.log(result))
        .catch(e => console.log(e))
}