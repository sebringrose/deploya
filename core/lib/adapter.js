export default class Adadper {
    constructor(
        functions
    ) {
        // bind adapter functions
        this.adapterFunctions = functions
    }

    async try(fcn, args) {
        let v
        try { v = await fcn(...args) } catch (e) { console.log(e); return e }
        return v
    }

    async deploy(config) {
        // get credentials
        console.log(`getting credentials for ${config.platform}...`)
        let credentials = await this.try(this.adapterFunctions.setup.credentials, [config])
        if (credentials instanceof Error) return console.log(credentials)
        console.log(`acquired ${config.platform} credentials`)

        // get client
        console.log(`creating client for ${config.service}...`)
        let client = await this.try(this.adapterFunctions.setup.client, [config, credentials])
        if (client instanceof Error) return console.log(client)
        console.log(`created ${config.service} client`)

        // run adapter stage function sequence
        const keys = Object.keys(this.adapterFunctions.stages)
        const stages = Object.values(this.adapterFunctions.stages)
        for (let i=0; i<stages.length; i++) {

            // check if exists
            console.log(`checking for existing ${keys[i]}...`)
            let check = await this.try(stages[i].check, [config, client])
            if (check instanceof Error) return console.log(check)
            console.log(`existing ${keys[i]} ${check}`)

            // update if exists, create if not
            if (check) {
                console.log(`updating ${keys[i]} ${check}`)
                let update = await this.try(stages[i].update, [config, client])  
                if (update instanceof Error) return console.log(update)
                console.log(`updated ${keys[i]}`)
            } else {
                console.log(`deploying new ${keys[i]}...`)
                let create = await this.try(stages[i].create, [config, client])
                if (create instanceof Error) return console.log(create)
                console.log(`deployed ${keys[i]}`)
            }
        }
    }
}