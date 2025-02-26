import { parse } from "yaml";
import { readFileSync } from "node:fs";
import { Config } from "../types";
import { exec } from "node:child_process";

/**
 * Loads the configuration file and parses it
 * @param path The path to the configuration file
 */
export async function parseConfig(path: string): Promise<Config> {
    const file = readFileSync(path, "utf8");
    return parse(file);
}

/**
 * Safely executes a command
 * @param command The command to execute
 * @returns The stdout and stderr from the command, alongside an error if there is one
 */
export async function execute(command: string): Promise<{ stdout: string; stderr: string, error?: Error }> {
    return new Promise((resolve) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                resolve({ stdout, stderr, error: err });
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}