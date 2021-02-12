import fs from 'fs'
import validateConfig from '../lib/validateConfig.js'

export default async function (config) {
    console.log("Starting deployment with Deploya...")

    console.log("validating deploya.config.json...")
    // initial validatation of provided config (this could be done with types)
    const configStatus = validateConfig(config)
    if (configStatus) return console.log(configStatus)

    // verify provided platform and service are supported
    const platform = config.platform.toLowerCase()
    const service = config.service.toLowerCase()
    let missing = !fs.existsSync(`./services/${platform}`) ? "platform" : 
        !fs.existsSync(`./services/${platform}/${service}/index.js`) ? "service" : null
    if (missing) return console.log(new Error(`
        Target ${missing} not supported. \n
        Please see https://github.com/sebringrose/dpa for a list of supported platforms and services.
    `))


    console.log(`target platform: ${platform}`)
    console.log(`target service: ${service}`)
    
    // import and initialise target adapter class with config
    import(`./${platform}/${service}/index.js`)
        .then(service => service.default.init(config))
        .then(result => console.log(result))
}