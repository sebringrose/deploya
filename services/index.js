import fs from 'fs'
import validateConfig from '../lib/validateConfig.js'

export default async function (config) {
    // initial validatation of provided config (this could be done with types)
    const configStatus = validateConfig(config)
    if (configStatus) return console.log(configStatus)

    // verify provided platform and service are supported
    const platform = config.platform.toLowerCase()
    const service = config.service.toLowerCase()
    let missing = !fs.existsSync(`./services/${platform}`) ? 
        "platform" : !fs.existsSync(`./services/${platform}/${service}.js`) ? 
            "service" : null

    if (missing) return console.log(new Error(`
        Target ${missing} not supported. \n
        Please see https://github.com/sebringrose/dpa for a list of supported platforms and services.
    `))
    
    // import and initialise target adapter class with config
    import(`./${platform}/${service}.js`)
        .then(service => service.init(config))
}