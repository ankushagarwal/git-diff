# GitDiff

GitDiff is a stripped-down fork of GitHub Desktop focused only on viewing Git
diffs. It is intended to be launched from a terminal with the `gitd` CLI,
usually from inside a Git repository.

The app keeps the familiar GitHub Desktop diff viewer, but hides the product
areas that are not needed for this workflow:

- no repository switching UI
- no History tab in the main sidebar
- no commit message inputs or commit buttons
- no untracked-file workflow
- no general-purpose GitHub Desktop onboarding or product surface

## Usage

Run `gitd` from inside a Git repository.

```sh
gitd
```

This opens GitDiff and shows the tracked working tree diff for the current
repository. Untracked files are ignored.

To show a specific commit or commit-like reference:

```sh
gitd HEAD
gitd 153d7d5313
gitd main~2
```

This is equivalent to using `git show` for that commit/ref. If GitDiff is
already open, the existing app window is reused and the diff view switches to
the requested repository/ref.

## Build

Install dependencies once:

```sh
corepack enable
corepack yarn install
```

Build the production app and CLI:

```sh
corepack yarn build:prod
```

The macOS app bundle is written to `dist/`. On Apple silicon this is normally:

```sh
dist/GitDiff-darwin-arm64/GitDiff.app
```

On Intel macOS it will use the matching `darwin-x64` directory.

## Install In `/Applications`

After a production build, copy the built app bundle into `/Applications`:

```sh
ditto dist/GitDiff-darwin-arm64/GitDiff.app /Applications/GitDiff.app
```

If you are on Intel macOS, use the `darwin-x64` build output instead:

```sh
ditto dist/GitDiff-darwin-x64/GitDiff.app /Applications/GitDiff.app
```

You can verify the installed app bundle with:

```sh
codesign --verify --deep --strict --verbose=2 /Applications/GitDiff.app
```

## Symlink `gitd`

The installed app contains the CLI wrapper at:

```sh
/Applications/GitDiff.app/Contents/Resources/app/static/gitd.sh
```

For a system-wide command:

```sh
sudo ln -sf /Applications/GitDiff.app/Contents/Resources/app/static/gitd.sh /usr/local/bin/gitd
```

For a user-local command:

```sh
mkdir -p ~/.local/bin
ln -sf /Applications/GitDiff.app/Contents/Resources/app/static/gitd.sh ~/.local/bin/gitd
```

Make sure the chosen directory is on your `PATH`, then verify:

```sh
gitd --help
```

## Development

Run the app in development mode:

```sh
corepack yarn start
```

Compile production assets without packaging:

```sh
corepack yarn compile:prod
```

## License

This project is based on GitHub Desktop and remains under the **[MIT](LICENSE)**
license. GitHub trademarks and logo assets remain subject to GitHub's trademark
rights and logo guidelines.
