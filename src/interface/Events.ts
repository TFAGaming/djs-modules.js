import {
    SlashCommandBuilder,
    ContextMenuCommandBuilder,
    UserContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction,
    ContextMenuCommandInteraction,
    Collection,
    Client,
    ChatInputCommandInteraction
} from "discord.js";
import { CommandBuilder } from "../class/CommandBuilder";

export interface Events<T extends Client, C = {}> {
    'commandSkip': [{
        structure: SlashCommandBuilder | ContextMenuCommandBuilder,
        reason: 'undefinedModule' | 'alreadyExist'
    }],
    'commandLoad': [structure: SlashCommandBuilder | ContextMenuCommandBuilder],

    'chatInputCreate': [interaction: ChatInputCommandInteraction, collection: Collection<string, CommandBuilder<T, C>>],
    'contextMenuCreate': [interaction: ContextMenuCommandInteraction, collection: Collection<string, CommandBuilder<T, C>>],
    'userContextMenuCreate': [interaction: UserContextMenuCommandInteraction, collection: Collection<string, CommandBuilder<T, C>>],
    'messageContextMenuCreate': [interaction: MessageContextMenuCommandInteraction, collection: Collection<string, CommandBuilder<T, C>>],

    'deployStart': [],
    'deployFinish': [],
    'deployError': [error: any]
};