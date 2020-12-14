const { readFileSync } = require('fs');

const readme = readFileSync('./README.md', {encoding:'utf8', flag:'r'});
const point = '<!-- 合集 -->';
const pointLocate = readme.indexOf(point);
const last = readme.substring(pointLocate, readme.length);
const total = last.split('github.com/online-books').length - 1;
console.log(total);
