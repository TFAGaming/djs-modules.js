import { EventEmitter } from 'node:events';
import {
    Client,
    Collection,
    ContextMenuCommandBuilder,
    REST,
    RESTOptions,
    Routes,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';
import { CommandBuilder, CommandBuilderProperties } from './CommandBuilder';
import { error, loadModules } from '../util';

interface HandlerOptions {
    includesDir?: boolean,
    defaultListener?: boolean,
    skipFileIfAlreadyExist?: boolean
};

interface DeployOptions {
    token: string,
    applicationId: string,
    REST?: RESTOptions,
    guildId?: string
};

export class Handler<ExtendedClient extends Client, ExtendedCustomOptions = {}> extends EventEmitter {
    readonly client: ExtendedClient;
    readonly path: string;
    readonly options: HandlerOptions | undefined;
    readonly collection: Collection<string, CommandBuilder<ExtendedClient, ExtendedCustomOptions>> = new Collection();
    public commands: (SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | ContextMenuCommandBuilder)[] = [];

    /**
     * Creates a command handler; Load all the modules automatically.
     * @param client The Discord bot client.
     * @param path The commands directory path (starts from the main folder path).
     * @param options Handler options.
     */
    constructor(client: ExtendedClient, path: string, options?: HandlerOptions) {
        if (!client) throw error(`The parameter 'client' is required.`);
        if (!(client instanceof Client)) throw error(`The parameter 'client' is not instance of Client.`);

        if (!path) throw error(`The parameter 'path' is required.`);
        if (typeof path !== 'string') throw error(`The parameter 'path' is not type of string, received ${typeof path}.`);

        super({ captureRejections: true });

        if (options?.defaultListener) {
            client.on('interactionCreate', async (interaction) => {
                if (interaction.isChatInputCommand()) {
                    if (!this.collection.has(interaction.commandName)) return;

                    const command = this.collection.get(interaction.commandName);

                    try {
                        command?.run(client, interaction, interaction.options);
                    } catch (err) {
                        console.warn('[djs-modules.js] Failed to finish executing the applicatio command \'' + interaction.commandName + '\' (' + interaction.commandId + ').\n' + err);
                    };
                };

                if (interaction.isContextMenuCommand()) {
                    if (!this.collection.has(interaction.commandName)) return;

                    const command = this.collection.get(interaction.commandName);

                    try {
                        command?.run(client, interaction);
                    } catch (err) {
                        console.warn('[djs-modules.js] Failed to finish executing the context command \'' + interaction.commandName + '\' (' + interaction.commandId + ').\n' + err);
                    };
                };
            });
        } else {
            client.on('interactionCreate', async (interaction) => {
                if (interaction.isChatInputCommand()) this.emit('chatInputCreate', interaction, this.collection);

                if (interaction.isContextMenuCommand()) this.emit('contextMenuCreate', interaction, this.collection);

                if (interaction.isUserContextMenuCommand()) this.emit('userContextMenuCreate', interaction, this.collection);

                if (interaction.isMessageContextMenuCommand()) this.emit('messageContextMenuCreate', interaction, this.collection);
            });
        };

        this.client = client;
        this.path = path;
        this.options = options;
    };

    /**
     * Defines a new command, make sure that you are exporting it by using the keyword `default`!
     */
    public command = class extends CommandBuilder<ExtendedClient, ExtendedCustomOptions> {
        constructor(data: CommandBuilderProperties<ExtendedClient, ExtendedCustomOptions>) {
            super({
                structure: data.structure,
                options: data.options,
                run: data.run
            });
        };
    };

    /**
     * Loads all the modules and the commands.
     * @returns {Collection<string, CommandBuilder<ExtendedClient>>}
     */
    public load(): Collection<string, CommandBuilder<ExtendedClient, ExtendedCustomOptions>> {
        const res = loadModules<ExtendedClient, ExtendedCustomOptions>(this.path, this.options?.includesDir);

        for (const module of res) {
            if (!module || !module?.structure) {
                this.emit('commandSkip', {
                    structure: module?.structure,
                    reason: 'undefinedModule'
                });

                continue;
            };

            if (this.collection.has(module?.structure?.name) && this.options?.skipFileIfAlreadyExist) {
                this.emit('commandSkip', {
                    structure: module?.structure,
                    reason: 'alreadyExist'
                });

                continue;
            };

            this.collection.set(module.structure?.name, module);
            this.commands.push(module?.structure);

            this.emit('commandLoad', module.structure);
        };

        return this.collection;
    };

    /**
     * Loads all commands structures (application commands) to Discord API.
     * @param options Deploy options.
     * @returns {Promise<undefined | any>}
     */
    public deploy(options: DeployOptions): Promise<undefined | any> {
        return new Promise(async (res, rej) => {
            try {
                this.emit('deployStart');

                const rest = new REST(options?.REST).setToken(options.token);

                if (options.guildId) {
                    await rest.put(Routes.applicationGuildCommands(options.applicationId, options.guildId), {
                        body: this.commands
                    });
                } else {
                    await rest.put(Routes.applicationCommands(options.applicationId), {
                        body: this.commands
                    });
                };

                this.emit('deployFinish');

                res(undefined);
            } catch (err) {
                this.emit('deployError', err);

                rej(err);
            };
        });
    };
};
