# @docker-watch/core

Core library for Docker-Watch.

Docker-Watch allows you to watch for Docker events and execute commands when those events occur. It is useful for automating tasks in response to Docker container lifecycle events.

## Installation

```bash
npm install @docker-watch/core
```

## Usage

```javascript
const { DockerWatchBase, parseConfig } = require("@docker-watch/core");

const config = parseConfig("./config.yml");
const dockerWatch = new DockerWatchBase(config);

// Your custom logic
dockerWatch.on("start", (container) => {
    console.log(`Container ${container.name} started`);
});
```

The package also exports a `parseConfig` function that can be used to parse a configuration file. This function takes a file path as an argument and returns a configuration object. Alongside this export, the package offers you the `DockerWatch` class which is built on top of the `DockerWatchBase` class. The `DockerWatch` class is a more user-friendly version of the `DockerWatchBase` class, providing a simplified and automated setup through a config file or config property. It is recommended to use the `DockerWatchBase` class unless you need the easy setup features of the `DockerWatchBase` class.

```javascript
const { DockerWatch, parseConfig } = require("@docker-watch/core");

const config = await parseConfig("config.yml");
const watcher = new DockerWatch(config);
// Initialize the watcher
watcher.initialize().catch(console.error);
```

## Configuration

Please refer to the [configuration documentation](https://github.com/TheDogHusky/docker-watch?tab=readme-ov-file#configuration) for more details on how to set up your configuration file.

## TypeScript support

As the package is built with TypeScript, it provides type definitions out of the box. You can use it in your TypeScript projects without any additional setup.

```typescript
import { DockerWatch, parseConfig } from "@docker-watch/core";

const config = await parseConfig("config.yml");
const watcher = new DockerWatch(config);

// Initialize the watcher
watcher.initialize().catch(console.error);
```

## License

The docker-watch project is licensed under the MIT licence.
