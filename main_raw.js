const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * 從 .dev.vars 讀取 target_folder
 */
function loadTargetFolder() {
  const varsPath = path.join(__dirname, '.dev.vars');
  const content = fs.readFileSync(varsPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || !trimmed) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (key === 'target_folder') {
      return value.replace(/^~/, os.homedir()).replace(/\\ /g, ' ');
    }
  }
  throw new Error('.dev.vars 中找不到 target_folder');
}

/**
 * 取得資料夾內所有 .md 檔案，依修改時間升序
 */
function getMdFilesSortedByTime(dir) {
  const names = fs.readdirSync(dir);
  const files = names
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const fullPath = path.join(dir, name);
      const stat = fs.statSync(fullPath);
      return { fullPath, name, mtime: stat.mtime };
    });
  files.sort((a, b) => a.mtime - b.mtime);
  return files;
}

/**
 * 合併多個 .md 檔內容（依時間先後）
 */
function mergeMdFiles(files) {
  const parts = [];
  for (const { fullPath, name } of files) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    parts.push(`<!-- 來源: ${name} -->\n\n${content}`);
  }
  return parts.join('\n\n---\n\n');
}

/**
 * 產生檔名用的 datetime 字串
 */
function getDatetimeString() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate()),
    '-',
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds()),
  ].join('');
}

function main() {
  const targetFolder = loadTargetFolder();
  if (!fs.existsSync(targetFolder)) {
    console.error('目標資料夾不存在:', targetFolder);
    process.exit(1);
  }

  const mdFiles = getMdFilesSortedByTime(targetFolder);
  if (mdFiles.length === 0) {
    console.log('目標資料夾中沒有 .md 檔案');
    return;
  }

  const merged = mergeMdFiles(mdFiles);
  const outName = `output-${getDatetimeString()}.md`;
  const outPath = path.join(__dirname, outName);
  fs.writeFileSync(outPath, merged, 'utf-8');
  console.log(`已合併 ${mdFiles.length} 個 .md 檔 -> ${outName}`);
}

main();
