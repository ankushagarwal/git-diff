import { join, resolve } from 'path'
import parse from 'minimist'
import { execFile, spawn } from 'child_process'

const run = (...args: Array<string>) => {
  function cb(e: unknown | null, _stdout?: string, stderr?: string) {
    if (e) {
      console.error(`Error running command ${args}`)
      console.error(stderr ?? `${e}`)
      process.exit(
        typeof e === 'object' && 'code' in e && typeof e.code === 'number'
          ? e.code
          : 1
      )
    }
  }

  if (process.platform === 'darwin') {
    execFile('open', ['-n', join(__dirname, '../../..'), '--args', ...args], cb)
  } else if (process.platform === 'win32') {
    const exeName = `GitDiff${__DEV__ ? '-dev' : ''}.exe`
    spawn(join(__dirname, `../../${exeName}`), args, {
      detached: true,
      stdio: 'ignore',
    })
      .on('error', cb)
      .on('exit', code => (process.exitCode = code ?? process.exitCode))
      .unref()
  } else {
    throw new Error('Unsupported platform')
  }
}

const args = parse(process.argv.slice(2), {
  alias: { help: 'h' },
  boolean: ['help'],
})

const usage = (exitCode = 1): never => {
  process.stderr.write(
    'GitDiff CLI usage: \n' +
      '  gitd          Show tracked working tree changes for the current repository\n' +
      '  gitd <ref>    Show the diff for a commit hash, branch, tag, or other commit ref\n'
  )
  process.exit(exitCode)
}

delete process.env.ELECTRON_RUN_AS_NODE

if (args.help || args._.at(0) === 'help') {
  usage(0)
} else {
  const [commitish, extraArg] = args._
  if (extraArg !== undefined) {
    usage(1)
  }

  const path = resolve('.')
  const cliArgs = [`--cli-diff-repo=${path}`]
  if (commitish !== undefined) {
    cliArgs.push(`--cli-diff-ref=${commitish}`)
  }

  run(...cliArgs)
}
