import * as vscode from 'vscode'

const EXTENSION_NAME = 'codeActionFromCommands'
const CONFIG_NAME = 'codeActions.definitions'

class CodeActionFromCommands implements vscode.CodeActionProvider {
    constructor(fullName: string, kind: vscode.CodeActionKind) {
        this.action = new vscode.CodeAction(fullName, kind)
        this.action.command = { command: fullName, title: fullName }
    }

    public provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext) {
        return context.triggerKind === vscode.CodeActionTriggerKind.Automatic ? [this.action] : null
    }

    readonly action: vscode.CodeAction
}

function setup(context: vscode.ExtensionContext) {
    // unregister all previous subscriptions except the one from onDidChangeConfiguration()
    while (context.subscriptions.length > 1) {
        context.subscriptions.pop()?.dispose()
    }

    const config = vscode.workspace.getConfiguration(EXTENSION_NAME).get<object>(CONFIG_NAME, {})

    for (const [codeActionName, codeActionDefinition] of Object.entries(config)) {
        const languages: string[] = codeActionDefinition['languages']
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

        const fullName = `${EXTENSION_NAME}.${codeActionName}`
        const kind = vscode.CodeActionKind.Source.append(fullName)
        const provider = new CodeActionFromCommands(fullName, kind)

        context.subscriptions.push(
            vscode.languages.registerCodeActionsProvider(selector, provider, {
                providedCodeActionKinds: [kind]
            }),
            vscode.commands.registerCommand(fullName, async function () {
                for (const command of codeActionDefinition['commands']) {
                    await vscode.commands.executeCommand(command)
                }
            }),
        )
    }
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(evt => {
            if (evt.affectsConfiguration(`${EXTENSION_NAME}.${CONFIG_NAME}`)) {
                setup(context)
            }
        })
    )

    setup(context)
}

export function deactivate() { }
