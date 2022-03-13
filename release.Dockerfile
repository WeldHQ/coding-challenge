FROM node:16.14 AS base
WORKDIR /app
ENV NODE_ENV=production \
    PATH="/app/node_modules/.bin:${PATH}"

FROM base AS dependencies
COPY package.json yarn.lock tsconfig.build.json /app/
RUN yarn install

FROM base AS build
COPY . /app/
COPY --from=dependencies /app/node_modules /app/node_modules
ARG APP_NAME=""
RUN npm run build ${APP_NAME}

FROM base
COPY --from=build /app/dist/ /app/dist/
COPY --from=dependencies /app/node_modules /app/node_modules
ARG APP_NAME=""
ENV APP_NAME=${APP_NAME}
CMD [ "sh", "-c", "node dist/apps/${APP_NAME}/main.js" ]
ENTRYPOINT []