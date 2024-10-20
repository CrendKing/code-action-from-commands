'use strict'

import * as vscode from 'vscode'

export class CodeActionFromCommands implements vscode.CodeActionProvider {
    constructor(commands: string[]) {
        this.commands = commands
    }

    public async provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext) {
        if (context.triggerKind === vscode.CodeActionTriggerKind.Automatic) {
            for (const cmd of this.commands) {
                await vscode.commands.executeCommand(cmd)
            }
        }

        return null
    }

    readonly commands: string[]
}

export function activate(context: vscode.ExtensionContext) {
    const extensionName = 'codeActionFromCommands'
    const definitions = vscode.workspace.getConfiguration(extensionName).get<object>('codeActions.definitions', {})

    for (const [codeActionName, codeActionDef] of Object.entries(definitions)) {
        const languages: string[] = codeActionDef['languages']
        let selector: vscode.DocumentSelector

        if (!languages) {
            selector = { scheme: 'file' }
        } else if (languages.length === 0) {
            continue
        } else {
            selector = languages.map(function (language) {
                return { scheme: 'file', language }
            })
        }

        const providerName = `${extensionName}.${codeActionName}`
        const commands: string[] = codeActionDef['commands']
        const provider = new CodeActionFromCommands(commands)

        context.subscriptions.push(
            vscode.languages.registerCodeActionsProvider(selector, provider, {
                providedCodeActionKinds: [vscode.CodeActionKind.Source.append(providerName)]
            }))
    }
}

export function deactivate() { }
