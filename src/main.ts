import * as core from '@actions/core'
import { MarkdownCreator } from './MarkdownCreator';

async function run(): Promise<void> {
  try {
    const jsonStr: string = core.getInput('jsonstring');
    const runtype: string = core.getInput('runtype');

    core.info(`json string received: ${jsonStr}`);

    const mdCreator = new MarkdownCreator();
    await mdCreator.summarize(jsonStr, runtype.toLocaleLowerCase() === 'dfa');

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
