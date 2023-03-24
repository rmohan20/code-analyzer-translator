import * as core from '@actions/core'
import { SummaryTableRow } from "@actions/core/lib/summary";
import { FlatSimpleViolation, FlatDfaViolation } from './types';
import { ViolationsHandler } from './ViolationsHandler';

// Mapping severities to emojis to display
const SEVERITY_TO_EMOJI_MAP = new Map<number, string>([
    [1, ':firecracker:'], 
    [2, ':zap:'], 
    [3, ':yellow_circle:'], 
    [4, ':warning:'], 
    [5, ':warning:']]);

export class MarkdownCreator {

    async checkActionNeeded(codeAnalyzerExitCode?: string): Promise<boolean> {
        // Continue only if exit code was provided. Else we'll figure out later.
        core.debug(`codeAnalyzerExitCode = ${codeAnalyzerExitCode}`);
        let isActionNeeded = true;
        if (codeAnalyzerExitCode) {
            const exitCodeNum: number = parseInt(codeAnalyzerExitCode);
            core.debug(`exitCodeNum = ${exitCodeNum}`);
            if (exitCodeNum === 0) {
                core.debug(`Received exit code 0`);
                this.successfulRun();
                isActionNeeded = false;
            } else if (exitCodeNum >= 5) {
                core.summary.addRaw(":no_entry_sign: Code Analyzer step failed. See logs for more information.");
                isActionNeeded = false;
            }

            if (!isActionNeeded) {
                await core.summary.write();
            }
        }

        return isActionNeeded;
    }

    async summarize(jsonString: string, isDfa: boolean): Promise<void> {
        try {
            // Don't process further if result file is empty
            if (!jsonString) {
                throw new Error("No results found.")
            }

            this.summarizeResults(jsonString, isDfa);

        } catch (error) {
            // Print error message in MD if valid error message is available
            if (error instanceof Error) {
                core.summary.addRaw(`:no_entry_sign: Encountered error while processing: ${error}`);
            }

            // Rethrow to fail the step
            throw error;
        } finally {
            await core.summary.write();
        }
        
    }

    private successfulRun(): void {
        core.summary.addHeading(":rocket: Code Analyzer");
        core.summary.addRaw(`:tada: No rule violations found.`)
    }

    private summarizeResults(jsonString: string, isDfa: boolean): void {
        core.summary.addHeading(":mag: Code Analyzer Results", 1);
        const handler: ViolationsHandler = new ViolationsHandler();

        if (isDfa) {
            const dfaResults = handler.parseDfa(jsonString);
            this.summarizeDfaResults(dfaResults);
        } else {
            const simpleResults = handler.parseSimple(jsonString);
            this.summarizeSimpleResults(simpleResults);
        }
    }

    private addFileNameHeader(fileName: string) {
        core.summary.addHeading(`:arrow_right: ${fileName}`, 3);
    }

    private summarizeSimpleResults(simpleResults: Map<string, FlatSimpleViolation[]>): void {
        for (const file of simpleResults.keys()) {
            const simpleViolations = simpleResults.get(file);
            if (!simpleViolations) {
                // Don't add anything if violations list is empty
                continue;
            }

            this.addFileNameHeader(file);

            const tableData: SummaryTableRow[] = [];
            tableData.push(this.simpleViolationHeader());
            for (const v of simpleViolations) {
                tableData.push(this.summarizeSimpleViolation(v))
            }

            core.summary.addTable(tableData);
        }
    }

    private summarizeDfaResults(dfaResults: Map<string, FlatDfaViolation[]>): void {
        for (const file of dfaResults.keys()) {
            const dfaViolations = dfaResults.get(file);
            if (!dfaViolations) {
                // Don't add anything if violations list is empty
                continue;
            }

            this.addFileNameHeader(file);

            const tableData: SummaryTableRow[] = [];
            tableData.push(this.dfaViolationHeader());
            for (const v of dfaViolations) {
                tableData.push(this.summarizeDfaViolation(v))
            }
            core.summary.addTable(tableData);
        }
    }

    private simpleViolationHeader(): SummaryTableRow {
        return [
            {data: 'Sev', header: true},
            {data: 'Rule', header: true}, 
            {data: 'Message', header: true}, 
            {data: 'Line', header: true}, 
            {data: 'Column', header: true}]
    }
    
    private summarizeSimpleViolation(simpleViolation: FlatSimpleViolation): SummaryTableRow {
        return [
            `${this.getViolationSeverity(simpleViolation.severity)}`,
            `<a href="${simpleViolation.url}">${simpleViolation.ruleName}</a>`, 
            simpleViolation.message, 
            `${simpleViolation.line}`, 
            `${simpleViolation.column}`];
    }

    private dfaViolationHeader(): SummaryTableRow {
        return [
            {data: 'Sev', header: true}, 
            {data: 'Rule', header: true}, 
            {data: 'Message', header: true}, 
            {data: 'Sink Filename', header: true},
            {data: 'Sink Line', header: true}, 
            {data: 'Sink Column', header: true}];
    }

    private summarizeDfaViolation(dfaViolation: FlatDfaViolation): SummaryTableRow {
        return [
            `${this.getViolationSeverity(dfaViolation.severity)}`,
            `<a href="${dfaViolation.url}">${dfaViolation.ruleName}</a>`, 
            dfaViolation.message, 
            `${dfaViolation.sinkFileName}`, 
            `${dfaViolation.sinkLine}`, 
            `${dfaViolation.sinkColumn}`];
    }

    private getViolationSeverity(severity: number): string {
        const returnVal = SEVERITY_TO_EMOJI_MAP.get(severity);
        if (returnVal) {
            return returnVal;
        }
        return "";
    }
}