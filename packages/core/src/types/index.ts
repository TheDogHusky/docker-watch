/**
 * The configuration for the container (config.yml)
 */
export interface Config {
	/**
	 * The command to execute on each event.
	 * If an event has a specific command, it will override this one.
	 *
	 * @example
	 * ```yaml
	 * global_command: "echo 'Event triggered'"
	 * events:
	 *  - name: "start"
	 *    command: "echo 'Container started'" # This will override the global command
	 * ```
	 */
	global_command: string;
	/**
	 * The events to watch for
	 */
	events: Event[];
	/**
	 * The path to the Docker socket
	 * Default: /var/run/docker.sock
	 * For now, only Unix sockets are supported. We do not support TCP sockets.
	 */
	socket_path?: string;

	/**
	 * The global conditions for the watcher
	 * Will be overridden by the event conditions
	 * @example
	 * ```yaml
	 * global_conditions:
	 *   env:
	 *     NODE_ENV: "production"
	 *     PORT: "3000"
	 *     DEBUG: "false"
	 *   container:
	 *     - name: "my_container"
	 *       value: "my_container_value"
	 *       # Any other container value
	 * ```
	 */
	global_conditions?: Conditions;
}

/**
 * An event to watch for
 */
export interface Event {
	/**
	 * The name of the event
	 */
	name: string;
	/**
	 * The command to execute on this event
	 */
	command?: string;
	/**
	 * The conditions for the event
	 */
	conditions?: Conditions;
}

/**
 * The conditions for the event
 */
export interface Conditions {
	/**
	 * The environment variables
	 */
	env?: Record<string, string>;
	/**
	 * The container conditions
	 */
	container?: ContainerCondition[];
}

/**
 * The container conditions
 */
export interface ContainerCondition {
	/**
	 * The name of the container
	 */
	name?: string;
	/**
	 * Any other container value
	 */
	[key: string]: string | undefined;
}

/**
 * The events for the watcher
 * @see https://docs.docker.com/reference/api/engine/version/v1.48/#tag/System/operation/SystemEvents
 * @example
 * ```typescript
 * import { DockerWatch } from "@docker-watch/core";
 * import { parseConfig } from "@docker-watch/core";
 *
 * const config = await parseConfig("config.yml");
 * const watcher = new DockerWatch(config);
 *
 * watcher.on("start", (data) => {
 *    console.log("Container started", data);
 * });
 */
export type Events = {
	attach: (data: any) => void;
	commit: (data: any) => void;
	copy: (data: any) => void;
	create: (data: any) => void;
	destroy: (data: any) => void;
	detach: (data: any) => void;
	die: (data: any) => void;
	exec_create: (data: any) => void;
	exec_detach: (data: any) => void;
	exec_die: (data: any) => void;
	exec_start: (data: any) => void;
	export: (data: any) => void;
	health_status: (data: any) => void;
	kill: (data: any) => void;
	oom: (data: any) => void;
	pause: (data: any) => void;
	rename: (data: any) => void;
	resize: (data: any) => void;
	restart: (data: any) => void;
	start: (data: any) => void;
	stop: (data: any) => void;
	top: (data: any) => void;
	unpause: (data: any) => void;
	update: (data: any) => void;
	error: (err: Error) => void;
	[event: string]: (data: any) => void;
};
