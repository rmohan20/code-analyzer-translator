import * as core from '@actions/core'
import { Violations } from './Violations';

async function run(): Promise<void> {
  try {
    const jsonStr: string = core.getInput('jsonstring');
    const runtype: string = core.getInput('runtype');

    core.info(`json string received: ${jsonStr}`);

    const violations = new Violations();
    await violations.summarize(jsonStr, runtype.toLocaleLowerCase() === 'dfa');

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
