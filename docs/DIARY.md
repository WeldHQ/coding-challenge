# Work Diary

- [Work Diary](#work-diary)
  - [Value For Myself](#value-for-myself)
  - [Value For You](#value-for-you)
  - [Notes](#notes)

## Value For Myself
I've found it useful to write down a very simple shortform work diary & Notes. It also helps me to pick up where I've left off when I work on fragmented hours and with collecting links to resources that are easy to misplace.

## Value For You
**Disclaimer: It's very raw on purpose. Not something I'd normally keep versioned.**

Since this is an interview, and interviewees like me tend to do it in weird hours or a very fragmented manner, it is important for the interwiever to also understand how I spend my time.

One could argue that this is what commit comments are for, but we all know that they present only a part of the picture - we stare at code/docs for much longer than we type. What you can observe here is the actual, raw, learning and discovery process.

## Notes

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


TODOS:
  - Postman export
  - Swagger api docs
  - 

