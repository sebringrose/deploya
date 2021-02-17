#!/usr/bin/env node

import run from '../lib/service.js'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const config = require(process.cwd() + '/deploya.config.json')

run(config)