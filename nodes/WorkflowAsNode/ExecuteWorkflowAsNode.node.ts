import {
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type ILoadOptionsFunctions,
	type INodeProperties,
	NodeConnectionType,
} from 'n8n-workflow';

export class ExecuteWorkflowAsNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Execute Workflow as Node',
		name: 'executeWorkflowAsNode',
		icon: 'fa:play-circle',
		group: ['transform'],
		version: 1,
		description: 'Executes a workflow that contains a "Workflow as Node Trigger"',
		defaults: {
			name: 'Execute Workflow as Node',
			color: '#ff6d5a',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Workflow',
				name: 'workflowId',
				type: 'workflowSelector',
				default: '',
				required: true,
			},
			{
				displayName: 'Configuration',
				name: 'config',
				type: 'json',
				default: '',
				required: true,
				description: 'Paste the configuration JSON from the trigger node here.',
			},
		],
	};

	loadOptions = {
		async getDynamicProperties(this: ILoadOptionsFunctions): Promise<INodeProperties[]> {
			const dynamicProperties: INodeProperties[] = [];
			const configStr = this.getCurrentNodeParameter('config') as string;

			if (!configStr) return [];

			try {
				const config = JSON.parse(configStr);

				// Create method dropdowns
				for (const methodName in config.methods) {
					const method = config.methods[methodName];
					dynamicProperties.push({
						displayName: method.displayName,
						name: methodName,
						type: 'options',
						options: method.options,
						default: method.options[0]?.value ?? '',
						noDataExpression: true,
					});
				}

				// Create input fields
				for (const field of config.inputFields) {
					dynamicProperties.push({
						displayName: field.displayName,
						name: field.name,
						type: field.type,
						default: field.default,
						displayOptions: { show: field.showWhen },
					});
				}
			} catch (e) {
				// Ignore JSON parsing errors
			}

			return dynamicProperties;
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const workflowId = this.getNodeParameter('workflowId', 0) as string;
		if (!workflowId) throw new Error('No workflow ID selected.');

		const allParameters = this.getNode().parameters;
		const executionData: { [key: string]: any } = {};

		// Gather all dynamic parameters
		for (const key in allParameters) {
			if (key !== 'workflowId' && key !== 'config') {
				executionData[key] = this.getNodeParameter(key, 0);
			}
		}

		const executionResult = await this.executeWorkflow(
			{ id: workflowId },
			[{ json: executionData }],
		);

		return executionResult.data.filter((d) => d !== null) as INodeExecutionData[][];
	}
}
