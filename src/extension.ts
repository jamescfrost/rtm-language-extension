// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { DocumentSymbolProvider } from './DocumentSymbolProvider';
import { WorkspaceSymbolProvider } from './WorkspaceSymbolProvider';
import { DefinitionProvider } from './DefinitionProvider';
import RtmWorkspace from './RtmWorkspace';
import Selection from "./Selection";
import Entity from './Entities/Entity';

const selector = { language: 'rtm', scheme: 'file' };

// const docSymbolProvider = new DocumentSymbolProvider();
// const workspaceSymbolProvider = new WorkspaceSymbolProvider(docSymbolProvider);
// const definitionProvider = new DefinitionProvider(workspaceSymbolProvider);
const rtmWorkspace = new RtmWorkspace();

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "rtm-language-extension" is now active!');

	// context.subscriptions.push(vscode.commands.registerCommand('extension.helloWorld', () => {
	// 	vscode.window.showInformationMessage('Hello World!');
	// }));

	context.subscriptions.push(vscode.languages.registerHoverProvider(selector, {
		async provideHover(doc, pos) {
			const wordRange = doc.getWordRangeAtPosition(pos);
			if (wordRange) {
				if (rtmWorkspace.loading) 
					return new vscode.Hover("Loading ...");
				const name = RtmWorkspace.getNameFromFilePath(doc.fileName);
				const source = rtmWorkspace.sources.find(s => s.name == name);
				const word = doc.getText(wordRange);
				const offset = doc.offsetAt(wordRange.start)
				const wordSelection = new Selection(offset, word.length);
				const overlay = source?.overlays.find(o => o.selection.intersection(wordSelection) != null);
				if (overlay) {
					let entity: Entity | undefined = (word == overlay.name) ? overlay : undefined;
					if (!entity)
						entity = overlay.exts.find(v => v.name == word);
					if (!entity)
						entity = overlay.files.find(v => v.name == word);
					if (!entity)
						entity = overlay.variables.find(v => v.name == word);
					if (!entity)
						entity = overlay.procedures.find(v => v.name == word);
					if (entity)
						return new vscode.Hover(entity.getDetail());
				}
			}
			return null;
		}
	}));

	//context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(selector, docSymbolProvider));

	//context.subscriptions.push(vscode.languages.registerWorkspaceSymbolProvider(workspaceSymbolProvider));

	//context.subscriptions.push(vscode.languages.registerDefinitionProvider(selector, definitionProvider));

	
	vscode.workspace.onDidOpenTextDocument((event) => {
		if (event.fileName.toUpperCase().endsWith(".RTM"))
			rtmWorkspace.loadSource(event);
	},);

	vscode.workspace.onDidChangeTextDocument((event) => {
		if (event.document.fileName.toUpperCase().endsWith(".RTM"))
			rtmWorkspace.loadSource(event.document);
	});

}