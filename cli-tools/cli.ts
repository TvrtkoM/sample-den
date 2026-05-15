#!/usr/bin/env ts-node

import { Command } from 'commander'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.development' })

import cleanAssets from './commands/clean-assets'

const program = new Command()

program.name('sample-tool').description('CLI utilities for managing audio samples').version('1.0.0')

program.addCommand(cleanAssets)

program.parseAsync(process.argv)
