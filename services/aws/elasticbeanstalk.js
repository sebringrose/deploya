import DPAdadper from '../../lib/adapter.js'
import { 
    ElasticBeanstalkClient, 
    AbortEnvironmentUpdateCommand 
} from "@aws-sdk/client-elastic-beanstalk";

const getCredentials = () => ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const initialiseClient = (region) => {
    if (!region) return new Error(`"region" attribute is missing from deploy.config.json`)

    const credentials = getCredentials()
    if (!credentials.accessKeyId) return new Error(`No AWS_ACCESS_KEY_ID environment variable found. \nDefine as AWS root user access key in .env file.`)
    if (!credentials.secretAccessKey) return new Error(`No AWS_SECRET_ACCESS_KEY environment variable found. \nDefine as AWS root user secret access key in .env file.`)

    return new ElasticBeanstalkClient({ region, ...credentials })
}

export default function (config) {
    let client = initialiseClient(config.region)
    console.log(client)
}

export default new DPAdadper({

})