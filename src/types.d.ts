type BaseViolation = {
	ruleName: string;
	message: string;
	severity: number;
	normalizedSeverity?: number;
	category: string;
	url?: string;
	exception?: boolean;
}

export type PathlessRuleViolation = BaseViolation & {
	line: number;
	column: number;
	endLine?: number;
	endColumn?: number;
};

export type DfaRuleViolation = BaseViolation & {
	sourceLine: number;
	sourceColumn: number;
	sourceType: string;
	sourceMethodName: string;
	sinkLine: number|null;
	sinkColumn: number|null;
	sinkFileName: string|null;
};

export type RuleViolation = PathlessRuleViolation | DfaRuleViolation;

export type RuleResult = {
	engine: string;
	fileName: string;
	violations: RuleViolation[];
};

