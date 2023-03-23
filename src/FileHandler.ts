import * as artifact from '@actions/artifact';
import * as core from '@actions/core';
import * as exec from '@actions/exec';

/**
 * Handles file read/write operations.
 */
export class FileHandler {
    /**
     * Downloads output file of Code Analyzer execution
     * @param outfileName Artifact name used to originally upload outfile
     * @param path Optional value if the file was stored in a specific path
     * @returns String contained in outfile
     */
    public async downloadOutfile(outfileName: string, path?: string): Promise<string> {
        const fileName = await this.downloadArtifact(outfileName, path);
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
     * @param path Used during upload step
     * @returns full file name of downloaded file
     */
    private async downloadArtifact(artifactName: string, path?: string): Promise<string> {
        const artifactClient = artifact.create();
        // const options = {
        //     rootDownloadLocation: "~/."
        // }
        const downloadResponse = await artifactClient.downloadArtifact(artifactName);
        return downloadResponse.downloadPath;
    }
}