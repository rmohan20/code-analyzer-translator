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

    // Download outfile and get JSON string
    const fileHandler = new FileHandler();
    const jsonStr = await fileHandler.downloadOutfile(outfileArtifactName, outfileArtifactPath);

    // Generate markdown
    const mdCreator = new MarkdownCreator();
    const isDfa = runtype.toLocaleLowerCase() === 'dfa';
    const exitCodeNum: number | undefined = (codeAnalyzerExitCode == undefined)? undefined : parseInt(codeAnalyzerExitCode);
    await mdCreator.summarize(jsonStr, isDfa, exitCodeNum);

    core.info("Finished rendering markdown output.");
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
