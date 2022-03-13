# Welcome to Welds coding-challenge

- [Welcome to Welds coding-challenge](#welcome-to-welds-coding-challenge)
  - [Introduction](#introduction)
- [👩‍🔬 Challenge Accepted](#-challenge-accepted)
  - [How to use](#how-to-use)
    - [Release](#release)
    - [Development](#development)
  - [Wouldbenices & Regrets](#wouldbenices--regrets)
- [Challenge](#challenge)
    - [Steps in challenge](#steps-in-challenge)
  - [How we evaluate](#how-we-evaluate)
  - [Project structure](#project-structure)
    - [data-streams:](#data-streams)
    - [worker:](#worker)
## Introduction
Here at Weld we use [NestJS](https://nestjs.com/) for our applications. So this project also reflects that. On our front-end we use NextJS and GraphQL. For simplicity we have used the monorepo structure from NestJS.

Fork this repository and create your own repository to get started.

# 👩‍🔬 Challenge Accepted
I've explained my reasoning thoroughly as part of the [RFC document](./docs/RFC.md). It should help asnwer some questions related to architecture, robustness and future prospects.

I did my best to treat the project like a real thing, not "just a challenge".

## How to use
The project assumes you have access to a docker-capable machine.

### Release
- Start the `docker-compose` project by running `./scripts/run-release.sh`. The release will take some time to build. 
- When everything is built, up and running, you should be able to visit `http://localhost:3000/api` where the Swagger docs are hosted.
- Open the newly created `.env` file and populate the `IQAIR_API_KEY` environment variable. Restart the project after doing so.

### Development
For development, I personally heavily rely on VSCode's Remote functionality. I use a separate docker-compose project:
```bash
# Run the project
./scripts/run-dev.sh
# Shell into the container (or even better, "Attach" via VSCode)
docker exec -ti weld_worker bash

# Run linting, tests, start
yarn lint
yarn test
yarn start
yarn start worker
```

## Wouldbenices & Regrets

- The start API endpoint can be used to actually define the stream (apiKey, interval, timeout)
- Results API pagination
- Use ISO8601+tz Date objects instead of timestamps
- Results could be persistent across restart with the simple use of NestJS cache module.
- Inconsistency in naming of classes, files and folders
- Had to force node env on jest. Don't know why.
- Have parametrized logger level control
- Should add a response facade on endpoints considered semi-public instead of returning raw worker responses.
- I'd keep Swagger docs stopped in releases, but since this is an interview, it makes sense to leave them
- I feel strongly about keeping config separate. It was not a good practice for me to merge them.

--
# Challenge
One of our customers wants us to help them build a pipeline for an API (select whichever you want from [Public APIs](https://github.com/public-apis/public-apis)). And they want us to setup a new data-pipeline for them to get information out and into their current data-warehouse.

To accomplish this you will build two services:
- **Data-streams**: Our API that can receive calls and issue commands to **worker**. This service also stores any information that our customer wants to fetch.
- **Worker:** Fetches the data from external API. Makes any transformations you see fit. And sends it back to **data-streams** for storage.

### Steps in challenge
- Configure a message protocol between the two services. You can get inspiration from the [nestjs docs.](https://docs.nestjs.com/microservices/basics) Choose which ever you want but tell us why in your answer.
- Create an endpoint on **data-streams** that tells **worker** to start fetching data on an interval (every 5 minutes).
- Setup an [http module](https://docs.nestjs.com/techniques/http-module) that **worker** can use to communicate with the external API.
- Send the data and store the results on **data-streams** using internal communication protocol.
- Make an endpoint on **data-streams** that can fetch the data stored on **data-streams**. Use whatever storage you see fit but tell us why you chose it.
- Make an endpoint on **data-streams** that can stop the data fetching on **worker**.

## How we evaluate
The test is solely for you to show techniques and design patterns you normally use. Once the techniques and design patterns have been demonstrated then that is enough. No neeed for additional boilerplate. Just include a future work section in your answer and we will include questions in the technical interview.

- We understand that this can be **time consuming**. If you are short on time - then leave something out. But be sure to tell us your approach to the problem in the documentation.
- A documented answer that explains your approach, short-comings, how-to-run and future work.
- A working solution. Preferably with some tests to give us an idea of how you write tests (you don't need to put it all under test).
- Reliability is very important when dealing with data-pipelines. So any measures you can add to keep the data-flowing will be appreciated.
- We appreciate small commits with a trail of messages that shows us how you work.

## Project structure
```
├── README.md
├── apps
│   ├── data-streams
│   └── worker
├── package.json
```
### data-streams:
This is our API. We will be able to issue HTTP requests to this and have it talk to our microservice **worker**.
We also store any information that **worker** sends our way. This project has been setup as a hybrid app. It can both function as an API but also as a microservice with an internal communication layer.

You can start data-streams with:
```
yarn start
```

### worker:
This is the worker microservice that is in charge of talking to the external API. It will fetch data when issued a command from **data-streams** and then return the results. This project only functions as a microservice which means it can only receive commands from the internal communication layer.

You can start worker with:
```
yarn start worker
```
