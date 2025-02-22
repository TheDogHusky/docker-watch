const Docker = require('dockerode');
const { exec } = require('child_process');

console.log("Starting..");

const docker = new Docker({
    socketPath: '/var/run/docker.sock'
});

console.log("Docker version: ");
docker.version().then(console.log).catch(console.error);
console.log("Listening for changes..");

docker.getEvents({}, (err, stream) => {
    if (err) {
        console.error(err);
        return;
    }

    stream.on('data', async (chunk) => {
        const data = JSON.parse(chunk.toString());
        if (data.Type !== "container") return;

        if (data.Action === "start") {
            try {
                const container = docker.getContainer(data.id);
                const details = await container.inspect();
                const env = details.Config.Env || [];

                const shouldReload = env.some(e => e.startsWith("NGINX_RELOAD_ENABLED=true"));

                if (shouldReload) {
                    console.log(`Container ${data.id} started. Reloading Nginx...`);
                    exec("sudo docker exec nginx nginx -s reload", (error, stdout, stderr) => {
                        if (error) {
                            console.error("Failed to reload Nginx:", stderr);
                        } else {
                            console.log("Nginx reloaded successfully.");
                        }
                    });
                }
            } catch (error) {
                console.error("Error inspecting container:", error.message);
            }
        } else if (data.Action === "destroy") {
            console.log(`Container ${data.id} removed. Reloading Nginx...`);
            exec("sudo docker exec nginx nginx -s reload", (error, stdout, stderr) => {
                if (error) {
                    console.error("Failed to reload Nginx:", stderr);
                } else {
                    console.log("Nginx reloaded successfully.");
                }
            });
        }
    });
});