const core = require("@actions/core");
const { context, getOctokit } = require("@actions/github");
const github = require("@actions/github");

const prNumber = github.context.payload.pull_request?.number;

async function checkComment (token) {
  const octokit = getOctokit(token);
  const { owner, repo } = context.repo;
  const response = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: prNumber,
    }
  );

  const previousReport = response.data.find((comment) =>
    comment.body?.startsWith(module.exports.generateTagLine())
  );

  return previousReport || null;
}

async function addComment (token, comment) {
  const octokit = getOctokit(token);
  const { owner, repo } = context.repo;
  const { data } = await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: comment,
  });

  return data;
}

async function updateComment (token, existingComment, comment) {
  const octokit = getOctokit(token);
  const { owner, repo } = context.repo;
  const { data } = await octokit.rest.issues.updateComment({
    owner,
    repo,
    comment_id: existingComment.id,
    body: comment,
  });

  return data;
}

module.exports = {
  generateTagLine () {
    return `<!-- Coverage Report: ${prNumber} -->` + "\n";
  },
  async postComment (token, comment) {
    const existingComment = await checkComment(token);

    if (existingComment) {
      core.info("Comment already exists. Updating the comment...");

      await updateComment(token, existingComment, comment);
    } else {
      core.info("Creating a new comment...");

      await addComment(token, comment);
    }
  },
};
