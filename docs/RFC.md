- Start Date: 05.03.2022
- Codename: coding-challenge

> **Comment for the interviewer:**
> I was told that you need to have a clear understanding of my intent. Especially in case I don't get to finish all the features.
> 
> I, on the other hand have no clue about the greater context this solution fits in (surrounding tech, other uses, infrastructure), so I need to analyse the given task in depth and save quite a lot of time by planning ahead.
> 
> Writing a RFC seemed like a good option that covers both needs well. :)

# Summary

A stream-worker pair with an adapter for reading data from IQAir.

- [Summary](#summary)
- [Motivation](#motivation)
- [How to use](#how-to-use)
  - [Development](#development)
  - [Runtime](#runtime)
- [Design and implementation](#design-and-implementation)
  - [Reasoning on Supporting Services:](#reasoning-on-supporting-services)
  - [Transport Protocol](#transport-protocol)
  - [Error Recovery](#error-recovery)
- [Drawbacks](#drawbacks)
  - [Alternatives](#alternatives)
  - [Future prospects](#future-prospects)

# Motivation

One of our customers wants us to help them build a pipeline for [IQAir API](https://www.iqair.com/us/commercial/air-quality-monitors/airvisual-platform/api). They wish us to pull the data regarding a given point into our data-warehouse on a regular basis.

# How to use

## Development
I will set up a `docker-compose` orchestrated project that will spawn the supporting services as well as the two microservices. Below are some common useful commands during development:

```json
// Run the project
./scripts/run-dev.sh
// Shell into the container (or even better, "Attach" via VSCode)
docker exec -ti weld_worker bash

// Run linting, tests, start
yarn lint
yarn test
yarn start
yarn start worker
```
- todo DB seeds

## Runtime

# Design and implementation

The initial task requires us to keep 2 services in a monorepo with use of `@nestjs/microservices`. Here is a general overview, based on those constraints:

- **Data-streams**: 
  - Essentially a ~supervisor~ manager of **worker** processes. 
  - Also persists the data in a permanent storage.
  - Offers a publicly available API endpoint for fetching stored data, starting and stoping worker.
- **Worker**:
  - Able to employ a HTTP adapter to fetch and transform data from external API.
  - External services they may fail, hang or provide corrupt data.
  - The task architecture explicitly requires us to perform data transformations within the worker runtime.

## Reasoning on Supporting Services:
- **PostgreSQL**:
  - Popular database. Open source and battle-tested, with a long and stabile history. 
  - Lightweight. If we wish to run this projet per customer, this might come in handy.
  - Allows jsonb data storage for our raw data.
  - Very good at concurrent writes.
- **Min.IO**: 
  - An object storage with a 100% S3 compatibile API. (Weld uses AWS afaik)
  - I'll use it to store the raw responses from other services, as well as intermediate transformed data in a place where other services can asynchronously fetch it later - or re-parse the original data.

## Transport Protocol

NestJS employs communication between microservices in a way that is modeled after the Actor Model. Our use case is fairly simple (`supervisor<->worker`) and we don't expect any complex crosstalk between actors. The built-in transport protocol abstractions give us additional assurance if we need to decouple services in the future. 

For our purposes, the default TCP transport will be more than enough. However we have to be mindful that it might be replaced with HTTP+AMQP in the future. So we will pretend that it already uses those:
  - The messages section is straightforward and most similar to what we would see with a HTTP or gRPC transports.
  - The events should keep in mind that message brokers have actual length limits, as well as being transient in their nature.

We have two separate concerns in the app. The usual `calls` vs `casts` situation:
  - **Messages:**
    - `worker:start`
      - Used to start the fetching process on a schedule.
      - Request is to provide the adapter configuration in following shape:
        ```json
          {
            "adapter": "IQAIR_DAILY",
            "interval": 300000,
            "timeout": 300000,
            "customer_id": "7a87fe83-f36b-41f4-8cba-7059058db649",
            "bucket_name": "results",
          }
        ```
      - Response will be idempotent.
      - Repeated calls will perform an abrupt stop and start action. This is to avoid having to meddle with debouncing.
      - Response shape: `{"success": true, "message":"Started fetching from adapter IQAIR_DAILY."}`
    - `worker:stop`
      - Used to stop the worker's fetching process. Will cancel any actions that might be in progress.
      - Response will be idempotent.
      - Response shape: `{"success": true, "message":"Stopped fetching from adapter IQAIR_DAILY."}`
  - **Events:**
    - `data-streams:worker_available`
      - The event signifies that a worker has started and has no job running. Usually as a result of complete failure like a pod restart.
      - Ideally, it would be responded to by sending a start message.
    - `data-streams:results`
      - The body will not contain the full payload. Instead we send only the reference to it.
      - The body will take the following shape:
        ```json
          {
            "adapter": "IQAIR_DAILY",
            "payload": {
              "id": "0c8d4136-8a96-48c4-8e41-52320f8d1194",
              "filename": "results/7a87fe83-f36b-41f4-8cba-7059058db649/0c8d4136-8a96-48c4-8e41-52320f8d1194.json"
            },
            "timestamp": "1646496980"
          }
        ```

## Error Recovery
The task itself explicitly states that `data-streams` is to get scheduled for a certain amount of time (5 min). We describe some common failure scenarios below:
  - `data-streams` crash would not impact the worker. It would keep persisting data to S3. It's results messages would pile on in Rabbit, and once restarted would get consumed.
  - `RabbitMQ/message-broker` crash is an irrecoverable event in terms that messages might get lost. If the worker did not crash, the data would still keep flowing, and being persisted to S3. Recovering from this is a future-prospect.
  - `worker` crash is a tricky one. The data would simply stop flowing. Orchestrator would restart the pod, and after booting up, the new pod would ask for a job. Then, it would be the `data-streams` decision if they wish to start it, based on previous input.
  - `worker` stuck in a timeout. For this scenario, the worker might allow the start configuration to describe what the maximum timeout is, after which the worker drops the current workload. This does not stop the worker. The default value will be the same as interval.

# Drawbacks

The absolute main drawback is that this setup assumes that we deploy a single instance of this project, per customer. Adding multitenancy would be possible with additional work on the database, but would raise scalability concerns. If we knew more about the product and use case, we could do it.

This comes hand in hadn with the fact that it allows only a single integration per customer. So defining multiple workers would be key to successful adoption. Unfortunately this raises various supervision and locking concerns. Again, if we knew more about the use case, this would be easier to mitigate. For an example, read the [Alternatives](#alternatives) section.

In a similar style, I could imagine that our Solutions Engineers actually want some custom transformations to be done on the data. Since this is an edge-service, that only provides raw data to our other services, its okay. In theory, we could supply some adapter-specific configuration related to data mapping to the worker.

## Alternatives

All alternatives have significant drawbacks in the context of our interview and they all are based around different deployment models.

My first instinct was the following idea: 
Decoupled worker services. We let k8s monitor them, scale up and down, load balance them. The workers themselves would asynchronously pick up messages from the Rabbit queue and publish their workload results. In theory it sounds simple, and that definitely is a popular strategy nowadays. The main benefit of this is that the data-streams replicas (and workers) themselves would be agnostic about which customer uses them, allowing us to scale it to an unreasonable degree.

![Decoupled Workers Alternative Approach](./decoupled-workers-chart.png)

**Problems of such an approach:**
- Autoscaling (or manual) would be tricky to get right at a Weld-production scale.
- Depending on k8s as a magic bullet for pod supervision.
- Potential problem of having too much backlog in RabbitMQ with jobs waiting, and no customer isolation in that scenario.
- Secrets sharing would become a nightmare.
- Introducing multiple services, plus a lot of devops overhead.
- I feel that the scaling problems could in fact be solved the old-school way. By sharding the customers onto separate data-streams instances which spawn an exact number of workers up front.
- **Most importantly, we are talking waay out of scope, and the task itself is very clear about the data-streams being able to directly control the workers.**

**Other notable alternatives:**

As part of the above, I've briefly considered that workers could be AWS lambdas. Lower costs plus all of the abovementioned benefits. **However, all of the above drawbacks, plus tough to work with locally, introduces a new tech stack, and finally, vendor-locks us to AWS.**

Cron jobs and a CLI script, as a traditional choice, could also work. **However communication between services would be hard to nail down, we would be unsure about what is running at all times and would have to manually manage crontab.**

As a remote alternative, I just want to point out that this type of project can be written in a OTP language, using just the basic primitives like [supervision tree](https://elixirschool.com/en/lessons/advanced/otp_supervisors), while getting a superior level of resilience and control. I'm not saying that because "[everything looks like a nail](https://www.explainxkcd.com/wiki/index.php/801:_Golden_Hammer)", **I'm aware of the organizational burden this would place on the team** - instead, I'm just trying to raise awareness about other tools/patterns 😉.

## Future prospects

- Would like event based internal communication instead of message-based. (forgot)
- Recover from arabbit crash
- DS being able to dynamically spawn more workers
- `data-streams:fail` - used for reporting