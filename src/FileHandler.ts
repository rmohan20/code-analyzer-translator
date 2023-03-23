import * as artifact from '@actions/artifact';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as path from 'path';

/**
 * Handles file read/write operations.
 */
export class FileHandler {
    /**
     * Downloads output file of Code Analyzer execution
     * @param outfileName Artifact name used to originally upload outfile
     * @param filePath Optional value if the file was stored in a specific path
     * @returns String contained in outfile
     */
    public async downloadOutfile(outfileName: string, filePath: string): Promise<string> {
        const fileName = await this.downloadArtifact(outfileName, filePath);
        const execOutput = await exec.getExecOutput(`cat ${fileName}`);
        if (execOutput.stderr) {
            core.error(`Error while reading file: ${execOutput.stderr}`);
        }
        
        const jsonStr = execOutput.stdout;
        core.info(`json string received: ${jsonStr}`);
        return jsonStr;
    }

    /**
     * Invokes GitHub download-artifact action
     * @param artifactName Used during upload step
     * @param filePath Used during upload step
     * @returns full file name of downloaded file
     */
    private async downloadArtifact(artifactName: string, filePath: string): Promise<string> {
        const artifactClient = artifact.create();
        // const options = {
        //     rootDownloadLocation: "~/."
        // }
        const downloadResponse = await artifactClient.downloadArtifact(artifactName);
        const artifactFile =  path.join(downloadResponse.downloadPath, filePath)
        return artifactFile;
    }
}