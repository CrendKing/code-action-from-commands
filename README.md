Create Code Action that executes sequence of commands, customizable via configuration.

Unlike the general, ubiquitous commands, [Code Action](https://code.visualstudio.com/docs/editor/refactoring) is a different kind of function that are more contextual to the specific content and language of the document.

While you can't execute a Code Action from the [Command Palette](https://code.visualstudio.com/api/ux-guidelines/command-palette), one unique feature that's only available through Code Action is [Code Actions on Save](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_code-actions-on-save). You can use it to execute a Code Action whenever a document is saved.

With this extension, you can create Code Action that executes sequence of commands. Then you can use it in the `editor.codeActionsOnSave` setting.

One way to know the ID of a command through the Command Palette is to click the gear icon to the right, then check the input box in the "Keyboard Shortcuts" page.

### Example configuration

```jsonc
"codeActionFromCommands.codeActions.definitions": {
    // Convert tab to spaces for ALL languages
    "tabToSpaces": {
        "commands": [
            "editor.action.indentationToSpaces"
        ]
    },

    // Preview the Markdown file on save
    "previewMarkdown": {
        "commands": [
            "markdown.showPreview"
        ],
        "languages": ["markdown"]
    },

    // No-op due to empty "languages" array
    "memo": {
        "commands": [
            "workbench.action.editor.changeEOL"
        ],
        "languages": []
    }
}

// enable Code Actions on Save
"editor.codeActionsOnSave": {
    "source.codeActionFromCommands.tabToSpaces": "always",
    "source.codeActionFromCommands.previewMarkdown": "explicit"
}
```

### Attribution

Extension icon: [Action figure icons created by Freepik - Flaticon](https://www.flaticon.com/free-icons/action-figure)
