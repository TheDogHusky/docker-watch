import DockerWatchBase from "./base";
import { Config, Hook } from "../types";
import { execute } from "../utils/functions";
import { ConsolaInstance } from "consola";

/**
 * The Docker Watcher
 *
 * By difference, this class adds a method to initialize the watcher, which will listen for events and run pre- and post-hooks for each event
 *
 * The base class only listens for events and emits them
 *
 * @param config The configuration for the watcher
 * @example
 * ```typescript
 * import { DockerWatch, parseConfig } from "@docker-watch/core";
 *
 * const config = await parseConfig("config.yml");
 * const watcher = new DockerWatch(config);
 * // Initialize the watcher
 * watcher.initialize().catch(console.error);
 * ```
 */
export default class DockerWatch extends DockerWatchBase {
    constructor(config: Config, logger?: ConsolaInstance) {
        super(config, logger);
    }

    /**
     * Initializes the Docker Watcher (starts watching for events, with hooks)
     * @example
     * ```typescript
     * import { DockerWatch, parseConfig } from "@docker-watch/core";
     *
     * const config = await parseConfig("config.yml");
     * const watcher = new DockerWatch(config);
     * watcher.initialize().catch(console.error);
     * ```
     */
    public async initialize() {
        this.config.events.forEach((event) => {
            this.logger.verbose(`Listening for ${event.name} events`);
            // Get the hooks for this event
            const hooks = this.config.hooks?.filter(
                (hook) => hook.event === event.name,
            );
            // Get the pre- and post-hooks
            const preHooks = hooks?.filter(
                (hook): hook is Hook<"before"> => hook.type === "before",
            );
            const postHooks = hooks?.filter(
                (hook): hook is Hook<"after"> => hook.type === "after",
            );

            this.logger.verbose(
                `Found ${preHooks?.length || 0} pre-hooks and ${postHooks?.length || 0} pre-hooks for ${event.name}`,
            );

            // Listen for the event
            this.on(event.name, async (data) => {
                this.logger.debug(`Event ${event.name} received`);
                this.logger.verbose(data);
                // Run the pre-hooks
                if (preHooks) {
                    for (const hook of preHooks) {
                        await hook
                            .code(this, data)
                            .catch((e: Error) => this.emit("error", e));
                        this.logger.verbose(
                            `Pre-hook executed for event ${event.name}`,
                        );
                    }
                }

                // Get the command to execute
                const command = this.config.global_command || event.command;
                if (!command) {
                    this.emit("error", new Error("No command provided"));
                    return;
                }
                // Execute the command and get the result
                const result = await execute(command).catch((e: Error) => {
                    this.emit("error", e);
                    return { stdout: "", stderr: "" };
                });

                this.logger.debug("Output", result);
                this.logger.verbose(`Command executed for event ${event.name}`);

                // Run the post-hooks
                if (postHooks) {
                    for (const hook of postHooks) {
                        await hook
                            .code(this, data, result)
                            .catch((e: Error) => this.emit("error", e));
                        this.logger.verbose(
                            `Post-hook executed for event ${event.name}`,
                        );
                    }
                }
            });
        });
    }
}
