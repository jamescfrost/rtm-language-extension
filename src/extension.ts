// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { DocumentSymbolProvider } from "./Providers/DocumentSymbolProvider";
import { WorkspaceSymbolProvider } from "./Providers/WorkspaceSymbolProvider";
import { DefinitionProvider } from "./Providers/DefinitionProvider";
import RtmWorkspace from "./RtmWorkspace";
import { HoverProvider } from "./Providers/HoverProvider";

const selector = { language: "rtm", scheme: "file" };

const rtmWorkspace = new RtmWorkspace();

// const docSymbolProvider = new DocumentSymbolProvider();
// const workspaceSymbolProvider = new WorkspaceSymbolProvider(docSymbolProvider);
const hoverProvider = new HoverProvider(rtmWorkspace);
const definitionProvider = new DefinitionProvider(rtmWorkspace);

export function activate(context: vscode.ExtensionContext) {
  console.log('"rtm-language-extension" activated!');

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.startTask", () => {
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "I am long running!",
          cancellable: true,
        },
        (progress, token) => {
          token.onCancellationRequested(() => {
            console.log("User canceled the long running operation");
          });

          progress.report({ increment: 0 });

          setTimeout(() => {
            progress.report({
              increment: 10,
              message: "I am long running! - still going...",
            });
          }, 1000);

          setTimeout(() => {
            progress.report({
              increment: 40,
              message: "I am long running! - still going even more...",
            });
          }, 2000);

          setTimeout(() => {
            progress.report({
              increment: 50,
              message: "I am long running! - almost there...",
            });
          }, 3000);

          const p = new Promise<void>((resolve) => {
            setTimeout(() => {
              resolve();
            }, 5000);
          });

          return p;
        }
      );
    })
  );

  context.subscriptions.push(vscode.languages.registerHoverProvider(selector, hoverProvider));

  //context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(selector, docSymbolProvider));

  //context.subscriptions.push(vscode.languages.registerWorkspaceSymbolProvider(workspaceSymbolProvider));

  context.subscriptions.push(vscode.languages.registerDefinitionProvider(selector, definitionProvider));

  vscode.workspace.onDidOpenTextDocument((event) => {
    if (event.fileName.toUpperCase().endsWith(".RTM"))
      rtmWorkspace.loadSource(event);
  });

  vscode.workspace.onDidChangeTextDocument((event) => {
    if (event.document.fileName.toUpperCase().endsWith(".RTM"))
      rtmWorkspace.loadSource(event.document);
  });
}
