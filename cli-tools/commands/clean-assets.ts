import { DeleteObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'
import { createClient } from '@sanity/client'
import chalk from 'chalk'
import { Command } from 'commander'
import { confirm } from '../utils/confirm'

const log = {
  header: (msg: string) => console.log('\n' + chalk.cyan(`◆ ${msg}`)),
  info: (msg: string) => console.log(chalk.white(`• ${msg}`)),
  success: (msg: string) => console.log(chalk.green(`✔ ${msg}`)),
  warn: (msg: string) => console.log(chalk.yellow(`⚠ ${msg}`)),
  del: (msg: string) => console.log(chalk.red(`✖ ${msg}`)),
}

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-10-10',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
})

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
})

const BUCKET = process.env.AWS_PRIVATE_BUCKET!

type SampleDoc = {
  highResFile?: {
    s3Key?: string
    mp3AssetId?: string
  }
  previewFile?: {
    asset?: {
      _ref?: string
    }
  }
}

const cleanAssets = new Command('clean-assets')
  .description('Remove unused WAV files from S3 and unused MP3 file assets from Sanity')
  .option('--dry-run', 'Show what would be deleted, but perform no deletions')
  .option('--force', 'Skip confirmation prompt and delete immediately')
  .option('--include-drafts', 'Include draft samples when determining which assets are still in use')
  .action(async ({ dryRun, force, includeDrafts }) => {
    log.header(
      includeDrafts ? 'Fetching ALL sample documents (including drafts)…' : 'Fetching ONLY published sample documents…',
    )

    const samples: SampleDoc[] = await sanity.fetch(`
      *[
        _type == "sample"
        ${includeDrafts ? '' : `&& !(_id in path("drafts.**"))`}
      ]{
        highResFile,
        previewFile
      }
    `)

    log.success(`Loaded ${samples.length} samples.`)

    const usedWavKeys = new Set(samples.map((s) => s.highResFile?.s3Key).filter((x): x is string => Boolean(x)))

    const usedMp3Ids = new Set(samples.map((s) => s.previewFile?.asset?._ref).filter((x): x is string => Boolean(x)))

    log.info(`WAVs in use: ${usedWavKeys.size}`)
    log.info(`MP3 assets in use: ${usedMp3Ids.size}`)

    log.header('Listing WAV files on S3…')

    const wavList = await s3.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: 'file/',
      }),
    )

    const allWavKeys: string[] = (wavList.Contents || []).map((obj) => obj.Key!)
    const unusedWavs = allWavKeys.filter((key) => !usedWavKeys.has(key))

    log.warn(`Unused WAV files found: ${unusedWavs.length}`)

    log.header('Listing MP3 assets in Sanity…')

    const allMp3Ids: string[] = await sanity.fetch(`
      *[_type == "sanity.fileAsset"]._id
    `)

    const unusedMp3 = allMp3Ids.filter((id) => !usedMp3Ids.has(id))

    log.warn(`Unused MP3 assets found: ${unusedMp3.length}`)

    if (dryRun) {
      log.warn('\nDry run mode enabled — no files will be deleted.')
      return
    }

    if (!force) {
      log.warn('\nThis will permanently delete:')
      console.log(`  • ${unusedWavs.length} WAV files from S3`)
      console.log(`  • ${unusedMp3.length} MP3 assets from Sanity`)
      if (includeDrafts) console.log(`\n⚠ Draft references are being honored.`)

      const ok = await confirm('Are you sure?')

      if (!ok) {
        log.warn('Aborted.')
        return
      }
    }

    log.header('Deleting unused WAV files…')

    for (const key of unusedWavs) {
      await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
      log.del(`WAV deleted: ${key}`)
    }

    log.header('Deleting unused MP3 assets…')

    for (const id of unusedMp3) {
      await sanity.delete(id)
      log.del(`MP3 asset deleted: ${id}`)
    }

    log.success('\nCleanup complete!')
  })

export default cleanAssets
