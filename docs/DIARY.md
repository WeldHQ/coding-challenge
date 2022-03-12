# Work Diary

- [Work Diary](#work-diary)
  - [Value For You](#value-for-you)
  - [Value For Myself](#value-for-myself)
  - [Debugging Notes](#debugging-notes)

## Value For You
None whatsoever. Please go read the [RFC](./RFC.md) instead.

## Value For Myself
I've found it useful to write down a very simple shortform work diary & Notes. It also helps me to pick up where I've left off when I work on fragmented hours and with collecting links to resources that are easy to misplace.

## Debugging Notes
  - Put on a singalong [playlist](https://youtube-playlist-randomizer.bitbucket.io/?pid=PLPX6lu9kG1JXtN3eWYd5AaNOpJG2GqeCP&autostart)
  - Download the project, read through all docs, get acquainted with NestJS fundamentals.
    - Look at prior art from forks. Might be useful to figure out the details around setting up tests, logging etc whenever I get stuck or need to look up coding style or idiomaticism.
      - [Richard](https://github.com/richardfarago/coding-challenge) 
        - **The only one who actually ended up working at Weld**
        - Uses kanye quotes, most likely chosen since it is funny, doesn't need auth AND the result is not static (less logic to write)
        - Didn't logically split the adapter from the worker
      - [Sebastian](https://github.com/sasp1/coding-challenge)
      - [Kasper](https://github.com/kasperhangard/coding-challenge)
      - [Bartozs](https://github.com/b-michalkiewicz/coding-challenge)
      - [Ashkay](https://github.com/akshaydk/coding-challenge)
    - Randomly browse through [NestJS docs](https://docs.nestjs.com/first-steps)
  - Draft [an RFC](./RFC.md) with some broad direction. Kristian said that its important for them, that I clearly define intent and what "the end goal" is.
    - Will use [IQAir API](https://api-docs.iqair.com) to aggregate Weld office air quality data
      - Requires a free API key, must remember to provide one to Kristian via Saltify.io
    - Did quite a lot of research regarding making resilient supervision trees in NestJS. 
      - Sidenote: Oh boy, am I spoiled by working with BEAM for 2 years 😢. This whole project fits into like 2 files in Elixir and offers way better guarantees.
      - Can't use NestJS processes or queues because they don't offer shutdown monitoring from the perspective of the supervisor - in other words, the workers won't be restarted if they crash.
      - The docs on microservices reveal that its just a simple wrapper arounds comms, not a process manager.
    - Picking a transport protocol ain't easy. Some actions require a message and some an event. Seems doable.
    - I got stuck in a loop there. There are a lot of unknowns and not a lot of constraints, so i wrote an essay on alternative solutions. Never feels good.
  - Started by making the environment work. On my current setup, I exclusively develop within containers so I have to add node dockerfile and setup scripts.
    - Ha, had to add `node_modules/.bin` to the path.
    - For some reason that eludes me, node claims that port 3000 is taken.
      - `lsof -i :3000` turns out the nest app tries to take the same port 2x.
      - Thats because I didn't have the correct setup for the microservice config
  - Finished the RFC. Did some Figma drawings, was quite fun.
    - Spend like 5 hours on that. Need sleep.
  - Its a brand new day lets figure out how config works.
    - Changing logger for a custom one, so that future changes can be made more easily
    - Luckily, the NestJS ecosystem has a nice JSON logger that people smarter than me have written.
    - Removed the middleware in favor of pino
  - Write a simple middleware for error formatting
  - Learn how to communicate with the worker
  - Validation and config as an extensible DTO
  - Useful snippets for microservice management: https://www.architect.io/blog/2020-09-08/creating-microservices-nestjs/
  - I started making an adapter, but i first need to handle the error cases, worker crashes when i return axios error???
    - microservices must return a grpc...
    - There is some weird behaviour from async and non async functions regarding catching exceptions. I am not entirely sure, but so far it seems that when a function is async, its exceptions happen outside the current stack, and have to be caught manually instead of the filter
  - Axios errors are a bit unpredictable. Implemented an axios utility fun


TODOS:
  - da saznam kako rade testovi ovi
  - Swagger api docs https://docs.nestjs.com/openapi/introduction
  - add a pretty hero png ajncer?
  - have a response facade on ds app tako da ne vracamo odgovore iz workers
  - da results bude persistant across restarts

QA: 
  - kad samo startujem worker, puca. vrv kad odradi statup event treba catch

WOULDBENICES:
  - worker config via validated types
  - paginacija
  - Postman export
  - use cron definition sent by the client `https://docs.nestjs.com/techniques/task-scheduling#dynamic-schedule-module-api`
  - use iso8601 tz dates instead of timestamps
  - inconsistency in naming of classes, files and folders
  - DTO validation is a bit repetitive, needs to check if sufficient

MAJOR ISSUES:
  - Figure out the exact difference in throwing behaviour between async and sync functions.
  - It seems that TS doesn't do runtime argument/return typechecks. Makes sense, but whats the point then?