import { Config, DockerWatch } from "@docker-watch/core";
import { OptionValues } from "commander";
import { logger } from "./constants";

/**
 * Handle the logic of the cli with the given options
 * @param config
 */
export async function handleWithConfig(config: Promise<Config>) {
    return new DockerWatch(await config, logger);
}

/**
 * Handle the logic of the cli with cli arguments
 * @param options
 */
export async function handleWithOptions(options: OptionValues) {
    const config: Config = {
        events: options.on.split(", ").map((event: string) => {
            return {
                name: event.trim(),
            };
        }),
        global_command: options.command,
    };

    logger.debug("Using generated config", config);

    return new DockerWatch(config, logger);
}
