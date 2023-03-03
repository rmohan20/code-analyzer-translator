import { RuleResult, RuleViolation, PathlessRuleViolation, DfaRuleViolation } from "./types";
import * as core from '@actions/core'
import { SummaryTableRow } from "@actions/core/lib/summary";

// Mapping severities to emojis to display
const SEVERITY_TO_EMOJI_MAP = new Map<number, string>([
    [1, ':firecracker:'], 
    [2, ':zap:'], 
    [3, ':yellow_circle:'], 
    [4, ':warning:'], 
    [5, ':warning:']]);

export class Violations {
    async summarize(jsonString: string, isDfa: boolean): Promise<void> {
        const ruleResult: RuleResult[]  = JSON.parse(jsonString);

        core.summary.addHeading(":mag: Code Analyzer Results", 1);
        // TODO: regroup by filename
        
        ruleResult.forEach(result => this.summarizeRuleResult(result, isDfa));

        await core.summary.write();
    }

    summarizeRuleResult(ruleResult: RuleResult, isDfa: boolean): void {
        core.summary.addHeading(`${ruleResult.engine}: ${ruleResult.fileName}`, 3);
        
        const tableData: SummaryTableRow[] = [];

        if (isDfa) {
            tableData.push(this.dfaViolationHeader());
            ruleResult.violations.forEach(violation => {
                tableData.push(this.summarizeDfaViolation(violation as DfaRuleViolation));
            });
        } else {
            tableData.push(this.simpleViolationHeader());
            ruleResult.violations.forEach(violation => {
                tableData.push(this.summarizeSimpleViolation(violation as PathlessRuleViolation));
            });
        }
        

        core.summary.addTable(tableData);
        
    }

    simpleViolationHeader(): SummaryTableRow {
        return [{data: 'Sev', header: true},{data: 'Rule', header: true}, {data: 'Message', header: true}, {data: 'Line', header: true}, {data: 'Column', header: true}]
    }
    summarizeSimpleViolation(simpleViolation: PathlessRuleViolation): SummaryTableRow {
        return [
            `${this.getViolationSeverity(simpleViolation.severity, simpleViolation.normalizedSeverity)}`,
            `<a href="${simpleViolation.url}">${simpleViolation.ruleName}</a>`, 
            simpleViolation.message, 
            `${simpleViolation.line}`, 
            `${simpleViolation.column}`];
    }

    dfaViolationHeader(): SummaryTableRow {
        return [{data: 'Sev', header: true}, {data: 'Rule', header: true}, {data: 'Message', header: true}, {data: 'Sink Filename', header: true}, {data: 'Sink Line', header: true}, {data: 'Sink Column', header: true}]
    }


    summarizeDfaViolation(dfaViolation: DfaRuleViolation): SummaryTableRow {
        return [
            `${this.getViolationSeverity(dfaViolation.severity, dfaViolation.normalizedSeverity)}`,
            `<a href="${dfaViolation.url}">${dfaViolation.ruleName}</a>`, 
            dfaViolation.message, 
            `${dfaViolation.sinkFileName}`, 
            `${dfaViolation.sinkLine}`, 
            `${dfaViolation.sinkColumn}`];
    }

    getViolationSeverity(severity: number, normalizedSeverity?: number): string {
        let returnVal: string | undefined;
        if (normalizedSeverity) {
            returnVal = SEVERITY_TO_EMOJI_MAP.get(normalizedSeverity)
        } else {
            returnVal = SEVERITY_TO_EMOJI_MAP.get(severity);
        }
        if (returnVal) {
            return returnVal;
        }
        return "";
    }
}