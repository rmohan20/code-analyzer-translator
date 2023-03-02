import * as core from '@actions/core'
import * as github from '@actions/github'
import { GitHubInteraction } from './GitHubInteraction';
import { Violations } from './Violations';

async function run(): Promise<void> {
  try {
    const jsonStr: string = core.getInput('jsonstring');

    core.info(`json string received: ${jsonStr}`);

    const violations = new Violations();
    await violations.summarize(jsonStr);

    // const interaction = new GitHubInteraction();
    // interaction.queryPullRequest();
    
    // core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    // core.debug(new Date().toTimeString())
    // await wait(parseInt(ms, 10))
    // core.debug(new Date().toTimeString())

    // core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

// async function commentTest(): Promise<void> {
//   const pullRequest = github.context.payload;

//   const githubToken = core.getInput('github_token');
//   const octokit = github.getOctokit(githubToken);

//   // await octoKit.rest.pulls.({
//   //   ...github.context.repo,
//   //   pull_number: pullRequest.number,
//   //   body: "Test data",
//   //   path: "force-app/main/default/classes/Cat.cls",
//   //   line: 3
//   // });
//   await octokit.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/comments', {
//     owner: github.context.repo.owner,
//     repo: github.context.repo.repo,
//     pull_number: pullRequest.number,
//     body: 'Testing comments',
//     commit_id: ,
//     path: 'force-app/main/default/classes/Cat.cls',
//     // start_line: 1,
//     // start_side: 'RIGHT',
//     line: 3,
//     // side: 'RIGHT',
//     headers: {
//       'X-GitHub-Api-Version': '2022-11-28'
//     }
//   })
// }

run()
