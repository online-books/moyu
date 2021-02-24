/**
 * 每周查询 fork 的仓库是否有新 fork 内容
 * 通过 issue 形式提醒 未分类 repo
 */
require('dotenv').config();
const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const glob = require('glob');

const { getDate } = require('./readme');

const {
  token,
} = process.env;

const octokit = new Octokit({ auth: `token ${token}` });

async function main() {
  try {
    async function queryRepos(page = 1) {
      let { data: repos } = await octokit.repos.listForOrg({
        org: 'online-books',
        type: 'forks',
        per_page: 100,
        page,
      });
      if (repos.length >= 100) {
        repos = repos.concat(await queryRepos(page+1));
      }
      return repos;
    }

    const oldForks = [];
    const paths = glob.sync('./json/*.json');
    paths.forEach(path => {
      const json = JSON.parse(fs.readFileSync(path, 'utf-8'));
      json.repo.forEach(repo => {
        oldForks.push(repo.url);
      })
    })

    const repos = await queryRepos();
    const noSyncs = [];
    repos.forEach(it => {
      if (!oldForks.includes(it.html_url)) {
        noSyncs.push(it.html_url);
      }
    })
    console.log(`old-length: ${oldForks.length}`);
    console.log(`new-length: ${repos.length}`);
    console.log(`noSyncs: ${noSyncs}`);

    if (oldForks.length !== repos.length) {
      let body = '';
      noSyncs.forEach(it => {
        body += `- ${it}
`;
      })

      await octokit.issues.create({
        owner: 'online-books',
        repo: 'moyu',
        title: `[Fork 检查][${getDate()}][数量：${noSyncs.length}]`,
        labels: ['Remind'],
        body,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

main();
