import { RuleResult, RuleViolation, PathlessRuleViolation, DfaRuleViolation } from "./types";
import * as core from '@actions/core'
import { SummaryTableRow } from "@actions/core/lib/summary";

export class Violations {
    async summarize(jsonString: string, isDfa: boolean): Promise<void> {
        const ruleResult: RuleResult[]  = JSON.parse(jsonString);

//         await core.summary
//   .addHeading('Code Analyzer Results')
//   .addCodeBlock(generateTestResults(), "js")
//   .addTable([
//     [{data: 'File', header: true}, {data: 'Result', header: true}],
//     ['foo.js', 'Pass '],
//     ['bar.js', 'Fail '],
//     ['test.js', 'Pass ']
//   ])
//   .addLink('View staging deployment!', 'https://github.com')
//   .write()

        core.summary.addHeading("Code Analyzer Results", 1);
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
        return [{data: 'Rule', header: true}, {data: 'Message', header: true}, {data: 'Line', header: true}, {data: 'Column', header: true}]
    }
    summarizeSimpleViolation(simpleViolation: PathlessRuleViolation): SummaryTableRow {
        return [`<a href="${simpleViolation.url}">${simpleViolation.ruleName}</a>`, simpleViolation.message, `${simpleViolation.line}`, `${simpleViolation.column}`]
    }

    dfaViolationHeader(): SummaryTableRow {
        return [{data: 'Rule', header: true}, {data: 'Message', header: true}, {data: 'Sink Filename', header: true}, {data: 'Sink Line', header: true}, {data: 'Sink Column', header: true}]
    }
    summarizeDfaViolation(dfaViolation: DfaRuleViolation): SummaryTableRow {
        return [`<a href="${dfaViolation.url}">${dfaViolation.ruleName}</a>`, dfaViolation.message, `${dfaViolation.sinkFileName}`, `${dfaViolation.sinkLine}`, `${dfaViolation.sinkColumn}`]
    }
}