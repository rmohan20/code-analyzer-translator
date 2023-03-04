import { RuleResult, PathlessRuleViolation, DfaRuleViolation, FlatDfaViolation, FlatSimpleViolation } from "./types";


export class ViolationsHandler {
    public parseDfa(jsonString: string): Map<string, FlatDfaViolation[]> {
        const results: RuleResult[]  = JSON.parse(jsonString);
        const violations = [];

        for (const result of results) {            
            for (const violation of result.violations) {
                const dv = violation as DfaRuleViolation;
                const formattedViolation: FlatDfaViolation = {
                    engine: result.engine,
	                fileName: result.fileName,
	                ruleName: dv.ruleName,
	                message: dv.message,
	                severity: dv.normalizedSeverity? dv.normalizedSeverity : dv.severity,
	                category: dv.category,
	                url: dv.url? dv.url : '',
	                sourceLine: dv.sourceLine,
	                sourceColumn: dv.sourceColumn,
	                sourceMethodName: dv.sourceMethodName,
	                sinkFileName: dv.sinkFileName,
	                sinkLine: dv.sinkLine,
	                sinkColumn: dv.sinkColumn
                }

                violations.push(formattedViolation);
            }
        }

        const dfaMap = groupBy(violations, v => v.fileName);

        return dfaMap;
    }


    public parseSimple(jsonString: string): Map<string, FlatSimpleViolation[]> {
        const results: RuleResult[]  = JSON.parse(jsonString);
        const violations = [];

        for (const result of results) {            
            for (const violation of result.violations) {
                const sv = violation as PathlessRuleViolation;
                const formattedViolation: FlatSimpleViolation = {
                    engine: result.engine,
	                fileName: result.fileName,
	                ruleName: sv.ruleName,
	                message: sv.message,
	                severity: sv.normalizedSeverity? sv.normalizedSeverity : sv.severity,
	                category: sv.category,
	                url: sv.url? sv.url : '',
	                line: sv.line,
	                column: sv.column
                }

                violations.push(formattedViolation);
            }
        }

        const simpleMap = groupBy(violations, v => v.fileName);

        return simpleMap;
    }

}

function groupBy<K, V>(array: V[], grouper: (item: V) => K) {
    return array.reduce((store, item) => {
      var key = grouper(item)
      if (!store.has(key)) {
        store.set(key, [item])
      } else {
        const val = store.get(key)
        if (val){
            val.push(item)
        }
      }
      return store
    }, new Map<K, V[]>())
  }