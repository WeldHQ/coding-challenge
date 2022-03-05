FROM node:16.14

WORKDIR /app

ENV XDG_DATA_HOME=/app/.tmp \
    NODE_ENV=development \
    PATH="/app/node_modules/.bin:${PATH}"

RUN apt-get update && apt-get install -y  \
    git \
    inotify-tools \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["/app/scripts/entrypoint_dev.sh"]