# Docker-Watch

docker-watch is a simple Node.js script to watch for container creation and deletion, and execute a command.

## Features

- Watch for container creation and deletion
- Execute a command when a container is created or deleted
- Crash-free (I hope, had no crashes so far)
- Simple to use

## Installation

```bash
git clone https://github.com/TheDogHusky/docker-watch.git
cd docker-watch
npm install
```

## Usage

```bash
node index.js
```

## Configuration

Sadly, I didn't take time for now to make this into a CLI or add any kind of configuration. You can edit the `index.js` file to change the command to execute, and the behavior.

For now this script only execute "`docker exec nginx nginx -s reload`" when a container is created or deleted, and when created, if it has the env variable "`NGINX_RELOAD_ENABLED=true`".

Please note that customization is planned for the future.

## License

This project is under the [MIT](LICENSE). Feel free to use it, modify it, and share it.

## Contributing

Feel free to contribute to this project by creating a pull request. I will review it as soon as possible.

## Support

If you have any questions, feel free to open an issue. I will answer it as soon as possible.