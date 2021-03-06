import { 
    ElasticBeanstalkClient,
    DescribeApplicationsCommand,
    CreateApplicationCommand
} from "@aws-sdk/client-elastic-beanstalk";

const getCredentials = async () => ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const getClient = async (config, credentials) => {
    if (!credentials.accessKeyId) return new Error(`
        No AWS_ACCESS_KEY_ID environment variable found.\n
        Define as AWS root user access key in .env file.
    `)

    if (!credentials.secretAccessKey) return new Error(`
        No AWS_SECRET_ACCESS_KEY environment variable found.\n
        Define as AWS root user secret access key in .env file.
    `)

    const client = new ElasticBeanstalkClient({ region: config.region, ...credentials })
    return client
}

const checkApplication = async (config, client) => {
    let results = await client.send(new DescribeApplicationsCommand({
        ApplicationNames: [ config.application ]
    }))
    let match = results.Applications.find(a => a.ApplicationName === config.application)
    if (match) return match.ApplicationArn
    return null
}

const createApplication = async (config, client) => 
    await client.send(new CreateApplicationCommand({
        ApplicationName: config.application, 
        Description: config.description
    }))

const updateApplication = async () => {
    return true
}

const checkEnvironment = async () => {
    return true
}

const createEnvironment = async () => {
    return true
}

const updateEnvironment = async () => {
    return true
}

const checkServices = async () => {
    return true
}

const createServices = async () => {
    return true
}

const updateServices = async () => {
    return true
}

export default {
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