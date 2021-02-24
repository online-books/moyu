/**
 * 通过修改 json 文件，来直接更新 Readme 信息
 */
const fs = require('fs');
const glob = require('glob');
const { BEFORE, TABLE, AFTER, getDate } = require('./util');

console.time('Update-README');
const paths = glob.sync('./json/*.json');
let total = 0;
let all = '';

paths.forEach(path => {
  const json = JSON.parse(fs.readFileSync(path, 'utf-8'));
  const ifShowRemark = Boolean(json.repo[0].remark);
  const length = json.repo.length;
  total += length;
  let title = '';
  if (json.lever === 2) {
    title = `## ${json.name} <kbd>${length}</kbd>`;
  } else if (json.order === 1) {
    title = `## ${json['up-name']}

### ${json.name} <kbd>${length}</kbd>`
  } else {
    title = `### ${json.name} <kbd>${length}</kbd>`;
  }

  let show = '';
  let content = '';
  if (ifShowRemark) {
    json.repo.forEach(repo => {
      content += `| [${repo.name}](${repo.url}) | ${repo.remark} |
`;
    })
    show = `${TABLE}
${content}`
  } else {
    json.repo.forEach(repo => {
      show += `- [${repo.name}](${repo.url})
`;
    })
  }

  all += `${title}

${show}
`;
});

const time = `- 📆 : <kbd>${getDate()}</kbd>
- 📊 : <kbd>${total}</kbd>
`;

const newReadme = `${BEFORE}
${time}
${all}${AFTER}
`;

fs.writeFileSync('./README.md', newReadme);
console.timeEnd('Update-README');
