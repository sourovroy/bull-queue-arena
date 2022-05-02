const express = require('express');
const path = require('path');
const Arena = require('bull-arena');
const Bull = require('bull');

// Select ports that are unlikely to be used by other services a developer might be running locally.
const HTTP_SERVER_PORT = 5006;
const REDIS_SERVER_PORT = 6379;

async function main() {
  const app = Arena(
    {
      Bull,

      queues: [
        {
          // Name of the bull queue, this name must match up exactly with what you've defined in bull.
          // Required for each queue definition.
          name: 'processor',

          // Hostname or queue prefix, you can put whatever you want.
          // User-readable display name for the host. Required.
          hostId: 'transcoder_process',

          prefix: 'transcoder_process_',

          // Queue type (Bull or Bee - default Bull).
          type: 'bull',

          redis: {
            host: "127.0.0.1",
            port: REDIS_SERVER_PORT,
          },
        },
      ]
    },
    {
      port: HTTP_SERVER_PORT,
      disableListen: false,
    }
  );

  app.use(express.static(path.join(__dirname, 'public')));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
