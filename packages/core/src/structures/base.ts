import Docker from "dockerode";
import { Config, Events } from "../types";
import EventEmitter from "node:events";
import TypedEmitter from "typed-emitter";

/**
 * The Docker Watcher Base
 *
 * @param config The configuration for the watcher
 * @example
 * ```typescript
 * import { DockerWatchBase, parseConfig } from "@docker-watch/core";
 *
 * const config = await parseConfig("config.yml");
 * const watcher = new DockerWatchBase(config);
 *
 * watcher.on("start", (data) => {
 *     console.log("Container started", data);
 * });
 * ```
 */
export default class DockerWatchBase extends (EventEmitter as new () => TypedEmitter<Events>) {
    public docker: Docker;
    public config: Config;

    constructor(config: Config) {
        super();
        this.config = config;
        // Create a new Docker instance
        this.docker = new Docker({
            socketPath: config.socket_path || "/var/run/docker.sock",
        });

        // Start watching for events
        this.docker.getEvents((err, stream) => {
            // If there is an error, emit it
            if (err) {
                this.emit("error", err);
            }

            // If the stream is not available, emit an error
            if (!stream) {
                this.emit("error", new Error("Stream is not available"));
                return;
            }

            // Listen for data events
            stream.on("data", (data) => {
                try {
                    // Parse the data
                    const event = JSON.parse(data.toString());
                    // Emit the event
                    this.emit(event.Action, event);
                } catch (e: any) {
                    // If there is an error, emit it
                    this.emit("error", e as Error);
                }
            });
        });
    }

    /**
     * The version of the Docker daemon
     * @returns The version of the Docker daemon
     * @example
     * ```typescript
     * const version = await watcher.version;
     * console.log(version);
     * ```
     */
    get version() {
        return this.docker.version();
    }

    /**
     * The information about the Docker daemon
     * @returns The information about the Docker daemon
     * @example
     * ```typescript
     * const info = await watcher.info;
     * console.log(info);
     * ```
     */
    get info() {
        return this.docker.info();
    }

    /**
     * The list of containers
     * @returns The list of containers
     * @example
     * ```typescript
     * const containers = await watcher.containers;
     * console.log(containers);
     * ```
     */
    get containers() {
        return this.docker.listContainers();
    }

    /**
     * The list of images
     * @returns The list of images
     * @example
     * ```typescript
     * const images = await watcher.images;
     * console.log(images);
     * ```
     */
    get images() {
        return this.docker.listImages();
    }

    /**
     * The list of networks
     * @returns The list of networks
     * @example
     * ```typescript
     * const networks = await watcher.networks;
     * console.log(networks);
     * ```
     */
    get networks() {
        return this.docker.listNetworks();
    }

    /**
     * The list of volumes
     * @returns The list of volumes
     * @example
     * ```typescript
     * const volumes = await watcher.volumes;
     * console.log(volumes);
     * ```
     */
    get volumes() {
        return this.docker.listVolumes();
    }

    /**
     * Get the events from the Docker daemon
     * @returns A readable stream of docker events
     * @example
     * ```typescript
     * const stream = await watcher.events;
     * stream.on("data", (data) => {
     *     console.log(data);
     * });
     * ```
     */
    get events() {
        return this.docker.getEvents();
    }
}
