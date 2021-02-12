export default class DPAdadper {
    constructor(
        getCredentials,
        getClient,
        checkApplication,
        createApplication,
        updateApplication,
        checkEnvironment,
        createEnvironment,
        updateEnvironment,
        checkServices,
        createServices,
        updateServices
    ) {
        // bind adapter functions
        this.adapterFunctions = {
            setup: {
                credentials: getCredentials,
                client: getClient
            },
            stages: {
                application: {
                    check: checkApplication,
                    create: createApplication,
                    update: updateApplication
                },
                environment: {
                    check: checkEnvironment,
                    create: createEnvironment,
                    update: updateEnvironment
                },
                services: {
                    check: checkServices,
                    create: createServices,
                    update: updateServices
                }
            }
        }
    }

    async init(config) {
        // run setup functions
        let credentials, client
        try {
            console.log(`getting credentials for ${config.platform}...`)
            credentials = await this.adapterFunctions.setup.credentials(config)
            console.log(`acquired ${config.platform} credentials`)
        } catch(e) { console.log(e) }
        try {
            console.log(`creating client for ${config.service}...`)
            client = await this.adapterFunctions.setup.client(config, credentials)
            console.log(`created ${config.service} client`)
        } catch(e) { console.log(e) }

        // run adapter stage function sequence
        const keys = Object.keys(this.adapterFunctions.stages)
        const stages = Object.values(this.adapterFunctions.stages)
        for (let i=0; i<stages.length; i++) {
            let check
            try {
                console.log(`checking for existing ${keys[i]}...`)
                check = await stages[i].check(config, client)
                console.log(`existing ${keys[i]} ${check}`)
            } catch(e) { return console.log(e) }

            if (check) try {
                console.log(`updating existing ${keys[i]}...`)
                await stages[i].update(config, client)
                console.log(`updated ${keys[i]}`)
            } catch(e) { 
                console.log(e) 
            } else try {
                console.log(`deploying new ${keys[i]}...`)
                await stages[i].create(config, client)
                console.log(`deployed ${keys[i]}`)
            } catch(e) { 
                console.log(e) 
            }
        }
    }
}