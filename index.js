import { config as envConfig } from 'dotenv'
import config from './dpa.config.json'
import run from './services/index.js'

envConfig()
run(config)