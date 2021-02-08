import { config as envConfig } from 'dotenv'
import config from './deploy.config.json'
import deploy from './services/index.js'

envConfig()
deploy(config)