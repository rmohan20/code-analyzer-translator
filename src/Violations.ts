import { RuleResult, RuleViolation } from "./types";
import * as core from '@actions/core'
import { SummaryTableRow } from "@actions/core/lib/summary";

export class Violations {
    async summarize(jsonString: string): Promise<void> {
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
        ruleResult.forEach(result => this.summarizeRuleResult(result));

        await core.summary.write();
    }

    summarizeRuleResult(ruleResult: RuleResult): void {
        core.summary.addHeading(`${ruleResult.engine}, ${ruleResult.fileName}`, 2);
        
    }

    summarizeViolation(ruleViolation: RuleViolation): void {
        core.summary.addRaw(`${ruleViolation.ruleName}: ${ruleViolation.message}`);
        core.summary.addLink(ruleViolation.ruleName, `${ruleViolation.url}`);
    }
}