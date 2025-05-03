# @docker-watch/cli

CLI tool for Docker-Watch.

Docker-Watch allows you to watch for Docker events and execute commands when those events occur. It is useful for automating tasks in response to Docker container lifecycle events.

## Installation

```bash
npm install -g @docker-watch/cli
```

## Usage

```bash
docker-watch [options]
```

## Options

```
-V, --version            output the version number
-d, --debug              output extra debugging
-c, --config <path>      set config path. defaults to ./docker-watch.yml. If no config file is found, the default values will be used.
-s, --silent             disable all output
-o, --on <events>        listen for events
-C, --command <command>  command to run when event is triggered
-v, --verbose            output extra information
-h, --help               display help for command
```

_from docker-watch -h_

## Example

```bash
docker-watch --command "docker exec nginx nginx -s reload" --on "start, destroy"
# Or for more customization, with a config file
docker-watch --config ./config.yml
```

## Configuration

Please refer to the [configuration documentation](https://github.com/TheDogHusky/docker-watch?tab=readme-ov-file#configuration) for more details on how to set up your configuration file.

## License

The docker-watch project is licensed under the MIT licence.
