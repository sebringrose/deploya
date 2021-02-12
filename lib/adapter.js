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
        // SETUP FUNCTIONS
        let credentials, client

        // credentials
        console.log(`getting credentials for ${config.platform}...`)
        try {
            credentials = await this.adapterFunctions.setup.credentials(config)
        } catch(e) { return e }
        console.log(`acquired ${config.platform} credentials`)

        // client
        console.log(`creating client for ${config.service}...`)
        try {
            client = await this.adapterFunctions.setup.client(config, credentials)
        } catch(e) { return e }
        console.log(`created ${config.service} client`)

        // run adapter stage function sequence
        const keys = Object.keys(this.adapterFunctions.stages)
        const stages = Object.values(this.adapterFunctions.stages)
        for (let i=0; i<stages.length; i++) {

            // check if exists
            let check
            console.log(`checking for existing ${keys[i]}...`)
            try {
                check = await stages[i].check(config, client)
            } catch(e) { return e }
            console.log(`existing ${keys[i]} ${check}`)

            // update if exists, create if not
            if (check) {
                console.log(`existing ${keys[i]} ${check}`)
                try {
                    await stages[i].update(config, client)  
                } catch(e) { return e }
                console.log(`updated ${keys[i]}`)
            } else {
                console.log(`deploying new ${keys[i]}...`)
                try {  
                    await stages[i].create(config, client)
                } catch(e) { return e }
                console.log(`deployed ${keys[i]}`)
            }
        }
    }
}