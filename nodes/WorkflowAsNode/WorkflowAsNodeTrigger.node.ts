import {
	type INodeExecutionData,
	NodeConnectionType,
	type IExecuteFunctions,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

export class WorkflowAsNodeTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Workflow as Node Trigger',
		name: 'workflowAsNodeTrigger',
		icon: 'fa:cogs',
		group: ['trigger'],
		version: 1,
		description: 'Define the inputs and methods for this workflow when it is used as a custom node.',
		defaults: {
			name: 'Workflow as Node Trigger',
			color: '#ff6d5a',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Note',
				name: 'note',
				type: 'notice',
				default: 'Define the methods and input fields for this workflow below. Then, copy the generated JSON from the "Node Configuration" field and paste it into the "Execute Workflow as Node" node.',
			},
			{
				displayName: 'Methods (as a JSON Object)',
				name: 'methods',
				type: 'json',
				default: '{\n  "action": {\n    "displayName": "Action",\n    "options": [\n      { "name": "Get", "value": "get" },\n      { "name": "Update", "value": "update" }\n    ]\n  }\n}',
				description: 'Define the method dropdowns as a JSON object. The key is the technical name.',
			},
			{
				displayName: 'Input Fields',
				name: 'inputFields',
				type: 'fixedCollection',
				placeholder: 'Add Input Field',
				default: {},
				typeOptions: { multipleValues: true },
				description: 'Define the input fields that will be available',
				options: [
					{
						displayName: 'Field',
						name: 'field',
						values: [
							{ displayName: 'Default Value', name: 'default', type: 'string', default: '' },
							{ displayName: 'Field Name', name: 'displayName', type: 'string', default: '' },
							{ displayName: 'Show When...', name: 'showWhen', type: 'json', default: '{ "action": "get" }', description: 'JSON object where keys are method technical names and values are the required option values'},
							{ displayName: 'Technical Name', name: 'name', type: 'string', default: '' },
							{ displayName: 'Type', name: 'type', type: 'options', options: [ { name: 'String', value: 'string' }, { name: 'Number', value: 'number' }, { name: 'Boolean', value: 'boolean' }], default: 'string' },
						],
					},
				],
			},
			{
				displayName: 'Node Configuration (Copy This)',
				name: 'nodeConfig',
				type: 'json',
				typeOptions: { readOnly: true },
				default: '={{JSON.stringify({ "methods": JSON.parse($parameter.methods), "inputFields": $parameter.inputFields.field })}}',
				description: 'Copy the JSON object below and paste it into the "Configuration" field of the "Execute Workflow as Node" node',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const inputData = this.getInputData();
		return [inputData];
	}
}
