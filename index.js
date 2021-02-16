import { config as envConfig } from 'dotenv'
import config from './deploya.config.json'
import run from './lib/services.js'

envConfig()
run(config)