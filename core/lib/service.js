import validateConfig from './validateConfig.js'
import services from '../supportedServices.json'

export default async function (config) {
    console.log("Starting deployment with Deploya...")

    console.log("validating deploya.config.json...")
    // initial validatation of provided config (this could be done with types)
    const configStatus = validateConfig(config)
    if (configStatus) return console.log(configStatus)

    console.log(`target platform: ${platform}`)
    console.log(`target service: ${service}`)

    // verify provided platform and service are supported
    const platform = config.platform.toLowerCase()
    const service = config.service.toLowerCase()
    let missing = !services.hasOwnProperty(platform) ? "platform" : 
        !services[platform].hasOwnProperty(service) ? "service" : null
    if (missing) return console.log(new Error(`
        Target ${missing} not supported. \n
        Please see https://github.com/sebringrose/deploya for a list of supported platforms and services.
    `))
    
    // import and initialise target adapter class with config
    import(`@deploya/${platform}-${service}`)
        .then(service => service.default.init(config))
        .then(result => console.log(result))
}