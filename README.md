# 👀 Docker-Watch

docker-watch is a simple Node.js script to watch for container creation and deletion, and execute a command.

It is available as a CLI, docker image, and Node.js module.

## Features

- 👀 Watch for container creation and deletion
- ⚡ Execute a command when a container is created or deleted
- 🎨 Customizable
- 🦾 Crash-free (I hope, had no crashes so far)
- 💡 Simple to use

## Installation

### CLI

```bash
npm install -g @docker-watch/cli
```

Usage:

```bash
docker-watch --command "docker exec nginx nginx -s reload" --on "start, destroy"
# Or for more customization, with a config file
docker-watch --config ./config.yml
```

### Docker

```bash
docker run -d --name docker-watch -v /var/run/docker.sock:/var/run/docker.sock -v /path/to/config.yml:/docker-watch.yml docker-watch/docker-watch:latest
```

Or with docker-compose:

```yaml
services:
    docker-watch:
        image: docker-watch/docker-watch:latest
        volumes:
            - /var/run/docker.sock:/var/run/docker.sock
            - /path/to/config.yml:/docker-watch.yml
        restart: always
```

### Node.js

If you wish to do anything using our API, you can install the module:

```bash
npm install @docker-watch/core
```

And use it in your code:

```javascript
const { DockerWatch, parseConfig } = require("@docker-watch/core");

const config = parseConfig("./config.yml");
const dockerWatch = new DockerWatch(config);

// Your custom logic
dockerWatch.on("start", (container) => {
    console.log(`Container ${container.name} started`);
});
```

## Configuration

The configuration file is a YAML file with the following structure:

```yaml
global_command: "docker exec nginx nginx -s reload" # Command to execute on event, can be overridden by container-specific command
conditions:
    env: # Only execute the command if the container has the following environment variables
        KEY: VALUE
    container: # Only execute the command if the container has the following name
        - name: "my_container"
          value: "my_value"
events:
    - name: "start" # Event name
      command: "docker exec nginx nginx -s reload" # Command to execute on event
      conditions: # Conditions to execute the command
          env: # Only execute the command if the container has the following environment variables
              KEY: VALUE
          container:
              - name: "my_container" # Only execute the command if the container has the following name
                value: "my_value"
```

## License

This project is under the [MIT](LICENSE). Feel free to use it, modify it, and share it.

## Contributing

Feel free to contribute to this project by creating a pull request. I will review it as soon as possible.

## Support

If you have any questions, feel free to open an issue. I will answer it as soon as possible.
