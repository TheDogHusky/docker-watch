import { consola, ConsolaOptions } from "consola";

/**
 * Get a logger instance
 * @param tag The tag to use for the logger
 * @param options The options to use for the logger (ConsolaOptions)
 */
export function getLogger(tag?: string, options: Partial<ConsolaOptions> = {}) {
    return tag ? consola.create(options).withTag(tag) : consola;
}

/**
 * Get the default logger instance with tag "docker-watch"
 */
export function getDefaultLogger() {
    return getLogger("docker-watch", {
        level: process.env.DEBUG ? 4 : 3,
    });
}
