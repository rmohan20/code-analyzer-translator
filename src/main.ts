import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const jsonStr: string = core.getInput('jsonstring');

    core.info(`json string received: ${jsonStr}`);

    await commentTest();
    
    // core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    // core.debug(new Date().toTimeString())
    // await wait(parseInt(ms, 10))
    // core.debug(new Date().toTimeString())

    // core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function commentTest(): Promise<void> {
  const pullRequest = github.context.payload;

  const githubToken = core.getInput('github_token');
  const octoKit = github.getOctokit(githubToken);

  await octoKit.rest.pulls.createReviewComment({
    ...github.context.repo,
    pull_number: pullRequest.number,
    body: "Test data",
    path: "force-app/main/default/classes/Cat.cls",
    line: 3
  });
}

run()
