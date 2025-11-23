import chalk from "chalk"

/**
 * Ask the user to confirm an action.
 *
 * @param message  The prompt message, e.g. "Are you sure?"
 * @param defaultYes  Whether Enter means "yes" (default false)
 */
export async function confirm(
  message: string,
  defaultYes = false
): Promise<boolean> {
  const suffix = defaultYes ? "(Y/n)" : "(y/N)"

  process.stdout.write(chalk.yellow(`${message} ${suffix} `))

  const answer = await new Promise<string>(resolve => {
    process.stdin.once("data", d => {
      resolve(String(d).trim().toLowerCase())
    })
  })

  // Important: allow Node to exit normally
  process.stdin.pause()

  if (!answer) {
    return defaultYes // user pressed Enter
  }

  return ["y", "yes"].includes(answer)
}
