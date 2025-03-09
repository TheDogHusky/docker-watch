import { DockerWatch, getDefaultLogger, parseConfig } from "@docker-watch/core";
import { join } from "node:path";

const logger = getDefaultLogger();

(async () => {
    const env = process.env;
    logger.debug("Environment variables: ", env);

    // If the debug flag is set, enable debugging
    if (env.DEBUG) {
        logger.level = 4;
    }

    // If the verbose flag is set, enable verbose output
    if (env.SILENT) {
        logger.level = 0;
    }

    logger.info("Starting Docker-Watch Runner");
    logger.debug("Reading configuration file");

    // Parse the configuration file mounted in the container
    const parsedConfig = await parseConfig(
        join(process.cwd(), "docker-watch.yml"),
    ).catch((err) => {
        logger.error("Error while parsing config file", err);
        process.exit(1);
    });

    logger.debug("Configuration file parsed successfully:", parsedConfig);

    // Initialize Docker-Watch
    logger.debug("Initializing Docker-Watch");

    const dockerWatch = new DockerWatch(parsedConfig);
    await dockerWatch.initialize().catch((err) => {
        logger.error("Error while initializing Docker-Watch", err);
        process.exit(1);
    });

    logger.info("Docker-Watch initialized successfully");
})().catch((err) => {
    logger.error("Error while starting Docker-Watch CLI", err);
    process.exit(1);
});
