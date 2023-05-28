import { readdirSync, lstatSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { CommandBuilder } from '../class/CommandBuilder';
import { Client } from 'discord.js';

export const loadModules = <ExtendedClient extends Client, ExtendedCustomOptions = { }>(path: string, includesDir?: boolean) => {
    const modules: CommandBuilder<ExtendedClient, ExtendedCustomOptions>[] = [];

    try {
        if (includesDir) {
            for (const dir of readdirSync(path)) {
                const newpath = join(path, dir);

                if (!lstatSync(newpath).isDirectory()) continue;
                
                readdirSync(join(newpath)).filter(f => f.endsWith(".js") || f.endsWith(".ts")).map((c) => {
                    const data = require(resolve("./", `${newpath}${newpath.endsWith("/") ? "" : "/"}${c}`)).default;

                    modules.push(data);
                });
            };
        } else {
            readdirSync(path).filter(f => f.endsWith(".js") || f.endsWith(".ts")).map((c) => {
                const data = require(resolve("./", `${path}${path.endsWith("/") ? "" : "/"}${c}`)).default;

                modules.push(data);
            });
        };
    } catch (err) {
        throw error(`Failed to load modules, received error:\n${err}`);
    };

    return modules;
};

export const error = (...message: string[]) => {
    return new Error(`${message.map((m) => m)}`);
};