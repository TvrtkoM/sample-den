import { Command } from "commander"
import chalk from "chalk"
import { createClient } from "@sanity/client"
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3"

const log = {
  header: (msg: string) => console.log("\n" + chalk.cyan(`◆ ${msg}`)),
  success: (msg: string) => console.log(chalk.green(`✔ ${msg}`)),
  warn: (msg: string) => console.log(chalk.yellow(`⚠ ${msg}`)),
  del: (msg: string) => console.log(chalk.red(`✖ ${msg}`)),
}

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2023-10-10",
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
})

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
})

type SampleDoc = {
  highResFile?: { s3Key?: string; mp3AssetId?: string },
  previewFile?: { asset?: { _ref?: string } }
};

const BUCKET = process.env.AWS_PRIVATE_BUCKET!

const cleanAssets = new Command("clean-assets")
  .description("Cleanup unused WAV and MP3 assets")
  .option("--dry-run", "Run without deleting files")
  .action(async ({ dryRun }) => {
    const deleting = !dryRun

    log.header("Fetching sample documents…")

    const samples = await sanity.fetch(`
      *[_type == "sample"]{
        highResFile,
        previewFile
      }
    `)

    const usedWavKeys = new Set(
      samples.map((s: SampleDoc) => s.highResFile?.s3Key).filter(Boolean)
    )

    const usedMp3Ids = new Set(
      samples
        .map((s: SampleDoc) => [
          s.highResFile?.mp3AssetId,
          s.previewFile?.asset?._ref,
        ])
        .flat()
        .filter(Boolean)
    )

    log.success(`Loaded ${samples.length} sample docs`)
    log.success(`WAV in use: ${usedWavKeys.size}`)
    log.success(`MP3 in use: ${usedMp3Ids.size}`)

    log.header("Listing WAV files from S3…")
    const wavList = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET, Prefix: "samples/" })
    )

    const allWavKeys = (wavList.Contents || []).map(o => o.Key!)
    const unusedWavs = allWavKeys.filter(k => !usedWavKeys.has(k))

    log.warn(`Unused WAV files: ${unusedWavs.length}`)

    log.header("Listing MP3 assets from Sanity…")
    const sanityAssets: string[] = await sanity.fetch(`
      *[_type == "sanity.fileAsset"]._id
    `)

    const unusedMp3 = sanityAssets.filter(id => !usedMp3Ids.has(id))

    log.warn(`Unused MP3 assets: ${unusedMp3.length}`)

    if (!deleting) {
      log.warn("Dry run: No deletions performed.")
      return
    }

    log.header("Deleting WAV files…")
    for (const key of unusedWavs) {
      await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
      log.del(`Deleted WAV: ${key}`)
    }

    log.header("Deleting MP3 assets…")
    for (const id of unusedMp3) {
      await sanity.delete(id)
      log.del(`Deleted MP3 asset: ${id}`)
    }

    log.success("Cleanup complete!")
  })

export default cleanAssets
