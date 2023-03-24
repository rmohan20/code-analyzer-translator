import * as core from '@actions/core'
import { FileHandler } from './FileHandler';
import { MarkdownCreator } from './MarkdownCreator';

async function run(): Promise<void> {
  try {
    // Get all input values
    const outfileArtifactName: string = core.getInput('outfile-artifact-name');
    const outfileArtifactPath: string = core.getInput('outfile-artifact-path');
    const codeAnalyzerExitCode: string = core.getInput('code-analyzer-exit-code');
    const runtype: string = core.getInput('runtype');

    const mdCreator = new MarkdownCreator();
    const isActionNeeded = await mdCreator.checkActionNeeded(codeAnalyzerExitCode);

    if (isActionNeeded) {
      // Download outfile and get JSON string
      const fileHandler = new FileHandler();
      const jsonStr = await fileHandler.downloadOutfile(outfileArtifactName, outfileArtifactPath);

      // Generate markdown
      const isDfa = runtype.toLocaleLowerCase() === 'dfa';
      await mdCreator.summarize(jsonStr, isDfa);

      core.info("Finished rendering markdown output.");
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
