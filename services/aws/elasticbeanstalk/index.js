import DPAdadper from '../../../lib/adapter.js'
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
    if (!credentials.accessKeyId) return new Error(`No AWS_ACCESS_KEY_ID environment variable found. \nDefine as AWS root user access key in .env file.`)
    if (!credentials.secretAccessKey) return new Error(`No AWS_SECRET_ACCESS_KEY environment variable found. \nDefine as AWS root user secret access key in .env file.`)

    return new ElasticBeanstalkClient({ region: config.region, ...credentials })
}

const checkApplication = async (config, client) => {
    let results
    try {
        results = await client.send(new DescribeApplicationsCommand({
            ApplicationNames: [ config.application ]
        }))
    } catch(e) { return e }
    console.log(results)
    if (results.Applications) {
        let match = results.Applications.find(a => a.ApplicationName === config.application)
        if (match) return match.ApplicationArn
        return null
    }
    return new Error("Unknown DescribeApplicationsCommand response format.")
}

const createApplication = async (config, client) => {
    let response
    try {
        response = await client.send(new CreateApplicationCommand({
            ApplicationName: config.application, 
            Description: config.description
        }))
    } catch(e) { return e }
    console.log(response)
    return true
}

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

export default new DPAdadper(
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
)