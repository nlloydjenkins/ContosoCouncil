# GitHub Copilot Setup Instructions for ContosoCouncil

## Overview
This document provides instructions for customizing GitHub Copilot responses to align with the ContosoCouncil project requirements.

## Custom Instructions

### Using `.github/copilot-instructions.md`
1. **Enable Custom Instructions**: Set the `github.copilot.chat.codeGeneration.useInstructionFiles` setting to `true` in VS Code.
2. **Create the File**: Add a `.github/copilot-instructions.md` file at the root of the workspace.
3. **Define Instructions**: Use Markdown to describe coding practices, preferred technologies, and project requirements.

### Using `.instructions.md` Files
1. **Create Instruction Files**: Run the `Chat: New Instructions File` command from the Command Palette.
2. **Specify Metadata**: Use Front Matter syntax to define `description` and `applyTo` properties.
3. **Define Content**: Write task-specific instructions using Markdown.

### Using VS Code Settings
1. **Define Instructions in Settings**: Add custom instructions in `settings.json` under `github.copilot.chat.codeGeneration.instructions`.
2. **Reference External Files**: Use the `file` property to include instructions from `.instructions.md` files.

## Prompt Files (Experimental)

### Creating Prompt Files
1. **Workspace Prompt Files**: Store `.prompt.md` files in the `.github/prompts` folder.
2. **User Prompt Files**: Store `.prompt.md` files in your VS Code profile folder.
3. **Define Metadata**: Use Front Matter syntax to specify `mode`, `tools`, and `description`.
4. **Define Content**: Write reusable prompts using Markdown.

### Using Prompt Files
1. **Run Prompt Files**: Use the `Chat: Run Prompt` command or type `/` followed by the prompt file name in the chat input field.
2. **Reference Other Files**: Link to workspace files, prompt files, or instruction files using Markdown links.

## Tips for Customization
- Keep instructions short and self-contained.
- Split instructions into multiple files for better organization.
- Use the `applyTo` property to automatically apply instructions to specific files or folders.
- Version control instruction files to track changes.

## Related Links
- [Custom Instructions Documentation](https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions)
- [Prompt Files Documentation](https://code.visualstudio.com/docs/copilot/copilot-customization#_prompt-files-experimental)
- [VS Code Settings](https://code.visualstudio.com/docs/copilot/copilot-customization#_settings)
