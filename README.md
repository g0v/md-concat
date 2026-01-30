# md_concact

Merge multiple `.md` files from a folder into one output file, ordered by **modification time**. Designed to work with output from [**Whispering**](https://epicenter.so/whispering/) — the open-source transcription app. Each source file is reduced to only `completedAt` (written as `timeStamp`) and `output` (written as `text`).

## Requirements

- Node.js (no extra packages)

## Usage

### 1. Set the target folder

Create a `.dev.vars` file in the project directory (if it doesn’t exist) and set the folder path that contains your Whispering transformation `.md` files:

```bash
# .dev.vars
target_folder = /absolute/path/to/your/md-folder
```

- Use `~` for your home directory, e.g. `target_folder = ~/Documents/notes`
- For paths with spaces, escape them: `target_folder = ~/Library/Application\ Support/com.bradenwong.whispering/transformation-runs`

### 2. Run the merge

From the project directory:

```bash
node main.js
```

On success you’ll see something like:

```
已合併 3 個 .md 檔 -> output-20260131-064353.md
```

### 3. Output

- Output filename format: `output-YYYYMMDD-HHmmss.md`
- The file is written in the **project directory** (same level as `main.js`)
- Each source file appears with only:
  - `timeStamp` (from source `completedAt`)
  - `text` (from source `output`)

## Source .md format

The script expects Whispering-style `.md` files (e.g. from **transformation-runs**) and keeps only:

1. The line starting with `completedAt` → written as `timeStamp`
2. The line(s) starting with `output` (including multiline values) → written as `text`

All other frontmatter or content is dropped.

## Notes

- `.dev.vars` is not committed (see `.gitignore`); create and fill it locally
- If the target folder doesn’t exist or has no `.md` files, the script prints an error or message and exits

## Related

- [Whispering](https://epicenter.so/whispering/) — Open source transcription app (local or cloud, transparent, no black box)
