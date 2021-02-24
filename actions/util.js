const BEFORE = `# 🐟 在线摸鱼减压

这里收集了免费的书籍、文章、资料、教程。随意点开，摸鱼减压。
`;

const TABLE = `| 名称 | 备注 |
| -- | -- |`;

const AFTER = `## 🆕 新 增

若您有新的资源推荐，可在 [New Recommend](https://github.com/online-books/moyu/issues/1) 中评论，或新开一个 [Issue](https://github.com/online-books/moyu/issues/new)。

## 💭 说 明

- 资源均来自互联网
- 若您有任何建议、疑问，请点击这里 [Issue](https://github.com/online-books/moyu/issues)

## LICENSE

[MIT](./LICENSE)`

function getDate() {
  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let day = now.getDate();
  day = day < 10 ? `0${day}` : day;
  const date = `${year}-${month}-${day}`;
  return date;
}

module.exports = {
  BEFORE,
  TABLE,
  AFTER,
  getDate,
};
