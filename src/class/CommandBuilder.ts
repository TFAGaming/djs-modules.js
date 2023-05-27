import {
    SlashCommandBuilder,
    ContextMenuCommandBuilder,
    Client,
    CommandInteraction,
    CommandInteractionOptionResolver,
    SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';

export type CommandBuilderProperties<T, C> = {
    structure: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | ContextMenuCommandBuilder;
    options?: C;
    run: (client: T, interaction: CommandInteraction, args?: Omit<CommandInteractionOptionResolver<'cached'>, "getMessage" | "getFocused">) => void;
};

export class CommandBuilder <ExtendedClient extends Client, ExtendedCustomOptions = { }> implements CommandBuilderProperties<ExtendedClient, ExtendedCustomOptions> {
    public structure: CommandBuilderProperties<ExtendedClient, ExtendedCustomOptions>['structure'];
    public options?: CommandBuilderProperties<ExtendedClient, ExtendedCustomOptions>['options'];
    public run: CommandBuilderProperties<ExtendedClient, ExtendedCustomOptions>['run'];

    /**
     * Creates a new command for the handler.
     * @param data Command builder structure.
     */
    constructor (data: CommandBuilderProperties<ExtendedClient, ExtendedCustomOptions>) {
        this.structure = data.structure;
        this.options = data.options;
        this.run = data.run;
    };
};
