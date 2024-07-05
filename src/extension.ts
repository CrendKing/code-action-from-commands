'use strict'

import * as vscode from 'vscode'

export class CodeActionFromCommands implements vscode.CodeActionProvider {
    constructor(commands: string[]) {
        this.commands = commands
    }

    public async provideCodeActions() {
        for (const cmd of this.commands) {
            await vscode.commands.executeCommand(cmd)
        }

        return null
    }

    readonly commands: string[]
}

export function activate(context: vscode.ExtensionContext) {
    const extensionName = 'codeActionFromCommands'
    const definitions = vscode.workspace.getConfiguration(extensionName).get<object>('codeActions.definitions', {})

    for (const [codeActionName, codeActionDef] of Object.entries(definitions)) {
        let selector: string[] | '*' = codeActionDef['languages']
        if (!selector) {
            selector = '*'
        } else if (selector.length === 0) {
            continue
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
