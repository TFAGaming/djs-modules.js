import { EventEmitter } from 'node:events';
import { Client, Collection, ContextMenuCommandBuilder, RESTOptions, SlashCommandBuilder } from 'discord.js';
import { CommandBuilder, CommandBuilderProperties } from './CommandBuilder';
import { Events } from './Events';

export interface HandlerOptions {
    includesDir?: boolean;
    defaultListener?: boolean;
    skipFileIfAlreadyExist?: boolean;
}

export interface DeployOptions {
    token: string;
    applicationId: string;
    REST?: RESTOptions;
    guildId?: string;
}

export declare class Handler<ExtendedClient extends Client, ExtendedCustomOptions = {}> extends EventEmitter {
    readonly client: ExtendedClient;
    readonly path: string;
    readonly options: HandlerOptions | undefined;
    readonly collection: Collection<string, CommandBuilder<ExtendedClient, ExtendedCustomOptions>>;

    commands: (SlashCommandBuilder | ContextMenuCommandBuilder)[];
    /**
     * Creates a command handler; Load all the modules automatically.
     * @param client The Discord bot client.
     * @param path The commands directory path (starts from the main folder path).
     * @param options Handler options.
     */
    constructor(client: ExtendedClient, path: string, options?: HandlerOptions);

    /**
     * Defines a new command, make sure that you are exporting it by using the keyword `default`!
     */
    command: {
        new (data: CommandBuilderProperties<ExtendedClient, ExtendedCustomOptions>): {
            structure: SlashCommandBuilder | ContextMenuCommandBuilder;
            options?: ExtendedCustomOptions | undefined;
            run: (client: ExtendedClient, interaction: import("discord.js").CommandInteraction<import("discord.js").CacheType>, args?: Omit<import("discord.js").CommandInteractionOptionResolver<"cached">, "getMessage" | "getFocused"> | undefined) => void;
        };
    };

    /**
     * Loads all the modules and the commands.
     * @returns {Collection<string, CommandBuilder<ExtendedClient>>}
     */
    load(): Collection<string, CommandBuilder<ExtendedClient, ExtendedCustomOptions>>;

    /**
     * Loads all commands structures (application commands) to Discord API.
     * @param options Deploy options.
     * @returns {Promise<undefined | any>}
     */
    deploy(options: DeployOptions): Promise<undefined | any>;

    on<E extends keyof Events<ExtendedClient, ExtendedCustomOptions>>(event: E, listener: (...args: Events<ExtendedClient, ExtendedCustomOptions>[E]) => void): this;
    once<E extends keyof Events<ExtendedClient, ExtendedCustomOptions>>(event: E, listener: (...args: Events<ExtendedClient, ExtendedCustomOptions>[E]) => void): this;
}
