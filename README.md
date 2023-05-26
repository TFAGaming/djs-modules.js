<div align="center">
    <img src="https://media.discordapp.net/attachments/1111644651036876822/1111644671639298118/6399729.png" width=70 height=70>
    <br>
    <h1>𝓶𝓸𝓭𝓾𝓵𝓮𝓼.𝓳𝓼</h1>
    <p>
        <h3>Yet another simplified commands handler for Discord bots</h3>
    </p>
    <img src="https://img.shields.io/npm/v/djs-modules.js?label=Latest%20version%3A">
    <img src="https://img.shields.io/snyk/vulnerabilities/npm/djs-modules.js?label=Vulnerabilities%3A">
    <img src="https://img.shields.io/npm/dm/djs-modules.js?label=Downloads%3A">
    <img src="https://img.shields.io/npm/l/djs-modules.js?label=License%3A">
    <br>
    <br>
</div>

# Introduction
**djs-modules.js** is a package that creates and load all commands from a folder. It supports Slash commands and Context menu commands, and it's very simple and easy to use.

## Requirements
- discord.js v14.9.0 or above.
- Node.js v16.9.0 or above.

## Installation
```coffee
npm install djs-modules.js
yarn add djs-modules.js
```

## Example n°1:
```
Example bot
├─── commands
│        └─── ping.ts
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
    id: 'Your bot ID'
};

export const handler = new Handler<client>(client, './commands/', {
    defaultListener: true
});

handler.on('commandLoad', (data) => console.log('Successfully loaded new command: ' + data.name));

handler.load();

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
import { handler } from '../index';

export default new handler.command({
    structure: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong!'),
    run: async (client, interaction) => {
        await interaction.reply({
            content: `Pong! ${client.ws.ping}`
        });
    }
});
```

## Example n°2:
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
    includesDir: true,
    defaultListener: false
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
import { handler } from '../index';

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
### Handler - constructor:

| Option | Type | Optional? | Default | Description |
| ------ | ------ | ------ | ------ | ------ |
| includesDir | boolean | Yes | false | Reads and loads other directories that exists in the provided folder path, including files.
| defaultListener | boolean | Yes | true | Trigger the property `run` from command builder whenever someone used it's application command name. If you have required custom options, you **must** set this property to `false`. |
| skipFileIfAlreadyExist | boolean | Yes | false | Skips a file if it's application command structure name already exists in the Collection. If the property's value is `false`, the original key's value (in collection) will be overwrited with another new module data. |

### Handler - deploy:
| Option | Type | Optional? | Default | Description |
| ------ | ------ | ------ | ------ | ------ |
| token | string | - | - | The Discord bot token. |
| applicationId | string | - | - | The Discord bot application ID. |
| REST | RESTOptions | Yes | { } | The REST options. |
| guildId | string | Yes | null | The guild ID to load the application commands on it.

## Events
| Option | Args | Description |
| ------ | ------ | ------ |

## License
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