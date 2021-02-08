import fs from 'fs'

export default async function (config) {
    const target = config.target.toLowerCase()
    const services = {}

    await Promise.all(fs.readdirSync('./services')
        .filter(x => !x.includes("."))
        .map(async service => services[service] = await import(`./${service}/index.js`)))

    if (!services[target]) return new Error(`
        "target" attribute in deploy.config.json is invalid. \n
        Please provide a supported cloud provider as target.
    `)
    
    services[target].default(config)
}