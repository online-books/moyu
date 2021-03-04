/**
 * 每周查询 fork 的仓库是否有新 fork 内容
 * 通过 issue 形式提醒 未分类 repo
 */
require('dotenv').config();
const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const glob = require('glob');

const { getDate } = require('./util');

const {
  token,
} = process.env;

const octokit = new Octokit({ auth: `token ${token}` });

const owner = 'online-books';
const repo = 'moyu';

async function main() {
  try {
    async function queryRepos(page = 1) {
      let { data: repos } = await octokit.repos.listForOrg({
        org: owner,
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

      const { data: issues } = await octokit.issues.listForRepo({
        owner,
        repo,
        state: 'open',
        labels: 'Remind',
      });

      if (issues.length == 1) {
        const beforeNum = issues[0].number;
        body += `

👾 Close invalid issue: #${beforeNum}`

        await octokit.issues.update({
          owner,
          repo,
          issue_number: beforeNum,
          state: 'closed',
        })
      }

      await octokit.issues.create({
        owner,
        repo,
        title: `[Fork 未录入检查][${getDate()}][数量：${noSyncs.length}]`,
        labels: ['Remind'],
        body,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

main();
