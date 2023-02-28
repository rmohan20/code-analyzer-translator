import * as core from '@actions/core'
import * as github from '@actions/github'

const CONTEXT = github.context;
export class GitHubInteraction {

    private github_token = core.getInput('github_token');

    public async queryPullRequest() {
        const octokit = github.getOctokit(this.github_token);
        const pulls = await octokit.rest.pulls.get({
            ...CONTEXT.repo,
            pull_number: CONTEXT.payload.number
        });

        core.info(`pulls = ${JSON.stringify(pulls)}`);

        const commit = pulls.data.commits.toString();

        const reviewComment = await octokit.rest.pulls.createReviewComment({
            ...CONTEXT.repo,
            pull_number: CONTEXT.payload.number,
            body: "Testing comments",
            commit_id: commit,
            path: "Cat.cls",
            line: 3,
            in_reply_to: undefined
        });

        core.info(`reviewComment = ${reviewComment}`);
    }
}