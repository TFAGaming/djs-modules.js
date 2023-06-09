# DELETED
## This package no longer exists, aqify.js replaced it.

<div align="center">
    <img src="https://media.discordapp.net/attachments/1111644651036876822/1111644671639298118/6399729.png" width=70 height=70>
    <h1>𝓶𝓸𝓭𝓾𝓵𝓮𝓼.𝓳𝓼</h1>
    <p>
        <h3>Yet another simplified commands handler for Discord bots.</h3>
    </p>
    <img src="https://img.shields.io/npm/v/djs-modules.js/latest?label=Latest%20version%3A">
    <img src="https://img.shields.io/npm/v/djs-modules.js/prerelease?label=Latest%20prerelease%20version%3A">
    <img src="https://img.shields.io/static/v1?label=100%%20written%20in:&message=TypeScript&color=007acc">
    <br>
    <img src="https://img.shields.io/snyk/vulnerabilities/npm/djs-modules.js?label=Vulnerabilities%3A">
    <img src="https://img.shields.io/npm/dm/djs-modules.js?label=Downloads%3A">
    <img src="https://img.shields.io/npm/l/djs-modules.js?label=License%3A">
    <img src="https://img.shields.io/discord/918611797194465280?color=5865F2&label=Discord:">
    <img src="https://img.shields.io/npm/collaborators/djs-modules.js?label=Collaborators%3A">
    <br>
</div>

# Introduction
**djs-modules.js** is a package that creates and load all commands from a folder. It supports Slash commands and Context menu commands, and it's very simple and easy to use.

## Table of Contents
- [modules.js](#)
- [Introduction](#introduction)
- [Requirements](#requirements)
- [Installation](#installation)
- [Example](#example)
- [Options](#options)
- [License (©)](#license-©)

## Requirements
- discord.js v14.9.0 or above.
- Node.js v16.9.0 or above.

> It's recommended to use TypeScript instead of JavaScript for the typings. If you're new on TypeScript, [click here](https://www.typescriptlang.org/).

## Installation
```coffee
npm install djs-modules.js
yarn add djs-modules.js
```

## Example
```
Example bot
├─── commands
│       └─── Utility
│               └─── ping.ts
└─── index.ts
```

**index.ts**:
```ts
import { Client } from 'discord.js';
import { Handler } from 'djs-modules.js';

const client = new Client({
    intents: ['Guilds']
});

const config = {
    token: 'Your bot token',
    id: 'Your bot ID',
    owner_id: 'Your account ID'
};

interface options {
    owner_only?: boolean
};

export const handler = new Handler<client, options>(client, './commands/', {
    includesDir: true
});

handler.on('commandLoad', (data) => console.log('Successfully loaded new command: ' + data.name));

handler.load();

handler.on('chatInputCreate', async (interaction, collection) => {
    const command = collection.get(interaction.commandName);

    if (!command) return;

    if (command.options) {
        if (command.options?.owner_only && interaction.user.id !== config.owner_id) {
            await interaction.reply({
                content: 'You are not the developer of the bot!',
                ephemeral: true
            });

            return;
        };
    };

    try {
        command.run(client, interaction, interaction.options);
    } catch { };
});

(async () => {
    await handler.deploy({
        token: config.token,
        applicationId: config.id
    });
})();

client.login(config.token);
```

**ping.ts**:
```ts
import { SlashCommandBuilder } from 'discord.js';
import { handler } from '../../index';

export default new handler.command({
    structure: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong!'),
    options: {
        owner_only: true
    },
    run: async (client, interaction) => {
        await interaction.reply({
            content: `Pong! ${client.ws.ping}`
        });
    }
});
```

## Options
### Type parameters:

| Parameter | Type | Optional? | Default | Description |
| ------ | ------ | ------ | ------ | ------ |
| ExtendedClient | extends Client | - | - | The Discord bot client. |
| ExtendedCustomOptions | object | Yes | { } | The custom options for each command builder. |

### The constructor:

| Option | Type | Optional? | Default | Description |
| ------ | ------ | ------ | ------ | ------ |
| includesDir | boolean | Yes | false | Reads and loads other directories that exists in the provided folder path, including files.
| defaultListener | boolean | Yes | false | Trigger the property `run` from command builder whenever someone used it's application command name. If you have required custom options, you **must** set this property to `false`. |
| skipFileIfAlreadyExist | boolean | Yes | false | Skips a file if it's application command structure name already exists in the Collection. If the property's value is `false`, the original key's value (in collection) will be overwrited with another new module data. |

### deploy() method:

| Option | Type | Optional? | Default | Description |
| ------ | ------ | ------ | ------ | ------ |
| token | string | - | - | The Discord bot token. |
| applicationId | string | - | - | The Discord bot application ID. |
| REST | RESTOptions | Yes | undefined | The REST options. |
| guildId | string | Yes | undefined | The guild ID to load the application commands on it.

## Events

| Event | Description |
| ------ | ------ |
| commandSkip | Whenever a command has been skipped by the loader. |
| commandLoad  | Whenever a command has been successfully loaded. |
| chatInputCreate | Whenever a Discord user has used a slash command. |
| contextMenuCreate | Whenever a Discord user has used a context menu command (user or message). |
| userContextMenuCreate | Whenever a Discord user has used a user context menu command. |
| messageContextMenuCreate | Whenever a Discord user has used a message context menu command. |
| deployStart | Whenever REST for application commands has started loading. |
| deployFinish | Whenever REST has successfully finished loading app. commands. |
| deployError | Whenever REST has caught an error. |

## License (©)
The MIT License

Copyright (c) 2023 T.F.A

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
