#!/usr/bin/env ts-node

import { loadEnvConfig } from '@next/env'
import { Command } from 'commander'

let env = process.env.NODE_ENV
if (!env) {
  env = 'development'
}

const projectDir = process.cwd()
loadEnvConfig(projectDir, env === 'development')

import cleanAssets from './commands/clean-assets'

const program = new Command()

program.name('sample-tool').description('CLI utilities for managing audio samples').version('1.0.0')

program.addCommand(cleanAssets)

program.parseAsync(process.argv)
