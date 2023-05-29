import { SlashCommandBuilder, ContextMenuCommandBuilder, Client, CommandInteraction, CommandInteractionOptionResolver, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';

export declare type CommandBuilderProperties<T, C> = {
    structure: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | ContextMenuCommandBuilder;
    options?: C;
    run: (client: T, interaction: CommandInteraction, args?: Omit<CommandInteractionOptionResolver<'cached'>, "getMessage" | "getFocused">) => void;
};

export declare class CommandBuilder<ExtendedClient extends Client, ExtendedCustomOptions = {}> implements CommandBuilderProperties<ExtendedClient, ExtendedCustomOptions> {
    structure: CommandBuilderProperties<ExtendedClient, ExtendedCustomOptions>['structure'];
    options?: CommandBuilderProperties<ExtendedClient, ExtendedCustomOptions>['options'];
    run: CommandBuilderProperties<ExtendedClient, ExtendedCustomOptions>['run'];
    
    /**
     * Creates a new command for the handler.
     * @param data Command builder structure.
     */
    constructor(data: CommandBuilderProperties<ExtendedClient, ExtendedCustomOptions>);
}
