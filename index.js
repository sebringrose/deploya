import { config as envConfig } from 'dotenv'
import config from './deploya.config.json'
import run from './services/index.js'

envConfig()
run(config)