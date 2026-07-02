export type CLIShowDiffTarget =
  | {
      readonly kind: 'working-directory'
    }
  | {
      readonly kind: 'commitish'
      readonly commitish: string
    }
  | {
      readonly kind: 'branch'
    }

export type CLIAction =
  | {
      readonly kind: 'open-repository'
      readonly path: string
    }
  | {
      readonly kind: 'clone-url'
      readonly url: string
      readonly branch?: string
    }
  | {
      readonly kind: 'show-diff'
      readonly path: string
      readonly target: CLIShowDiffTarget
    }
