import { parse } from "yaml";
import { readFileSync } from "node:fs";
import { Config } from "../types";

/**
 * Loads the configuration file and parses it
 * @param path The path to the configuration file
 */
export async function parseConfig(path: string): Promise<Config> {
    const file = readFileSync(path, "utf8");
    return parse(file);
}
