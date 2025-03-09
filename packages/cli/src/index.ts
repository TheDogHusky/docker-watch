import { program } from "commander";
import packageJson from "../package.json";
import { DockerWatch, parseConfig } from "@docker-watch/core";
import { logger } from "./utils";
import { handleWithConfig, handleWithOptions } from "./utils";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

program.version(packageJson.version);

program
    .name("docker-watch")
    .description(
        "CLI tool for Docker-Watch. Allows you to watch for docker container events and run commands accordingly.",
    )
    .option("-d, --debug", "output extra debugging")
    .option(
        "-c, --config <path>",
        "set config path. defaults to ./docker-watch.yml. If no config file is found, the default values will be used.",
    )
    .option("-s, --silent", "disable all output")
    .option("-o, --on <events>", "listen for events")
    .option("-C, --command <command>", "command to run when event is triggered")
    .option("-v, --verbose", "output extra information")
    .parse(process.argv);

const options = program.opts();

// If the debug flag is set, enable debugging
if (options.debug) {
    process.env.DEBUG = "true";
    logger.level = 4;
}

// If the verbose flag is set, enable verbose output
if (options.verbose) {
    logger.level = 999;
}

// If the silent flag is set, disable all output
if (options.silent) {
    logger.level = 0;
}

(async () => {
    logger.debug("Starting Docker-Watch CLI");
    logger.debug("CLI Options", options);

    // If no options are provided, exit
    if (!options.config && !options.on && !options.command) {
        logger.error("No configuration options provided. Exiting...");
        process.exit(1);
    }

    let dockerWatch: DockerWatch | undefined;

    try {
        // If the config flag is set, use that config file
        if (options.config) {
            logger.debug("Using config file", options.config);
            // how to revolve the path from the place where the process has been started
            const relativePath = resolve(process.cwd(), options.config);
            logger.debug("Relative path", relativePath);
            if (!existsSync(relativePath)) {
                logger.error(
                    "Config file does not exist: ",
                    resolve(relativePath),
                );
                process.exit(1);
            }
            const config = parseConfig(relativePath);
            dockerWatch = await handleWithConfig(config);
        } else {
            logger.debug("Using options", options);
            dockerWatch = await handleWithOptions(options);
        }

        if (!dockerWatch) {
            throw new Error("Docker-Watch is not defined");
        }

        // Let the fun begin!
        logger.info("Listening for Docker events...");
        await dockerWatch.initialize();

        dockerWatch.on("error", (err) => {
            logger.error("Error from Docker-Watch", err.stack);
        });
    } catch (err) {
        logger.error("Error while handling Docker-Watch", err);
        process.exit(1);
    }

    ["SIGINT", "SIGTERM"].forEach((signal) => {
        process.on(signal, () => {
            logger.info(`Received ${signal}, exiting...`);
            // If possible, gracefully exit docker-watch (will be added if needed and I find any graceful shutdown elements on dockerode)
            process.exit(0); // for now, just exit
        });
    });
})().catch((err) => {
    logger.error("Error while starting Docker-Watch CLI", err);
    process.exit(1);
});
