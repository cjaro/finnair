import * as child from 'child_process';

const author = child.execSync('git config --get user.email').toString().trim();
const commits = child.execSync(`git log --author=${author}`).toString().trim();

console.log("Commits by", author);

if (!commits) {
  console.error('This repo has no commits from the current git user. Did you commit your changes?');
  process.exit(1);
}

const bundleName = "finnair-code-project";
const result = child.execSync(`git bundle create ${bundleName}.bundle HEAD master`);
console.log(`${bundleName}.bundle has been created!`);
