# discord.js-template-typescript
A little template for developing Discord bots in Typescript.

---

## Table of Contents
- [Dependencies](#dependencies)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Typescript](#typescript)

## Dependencies
[![Node.js](https://img.shields.io/badge/node.js-%233C873A.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![npm](https://img.shields.io/badge/npm-%23CC3534.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)

## Quick start
1. **Get this template:** Click on the "Use this template" button. This will allow you to create a new repository with this project's structure on your Github account. Then you can clone it to your local machine.

    Alternatively, you can clone this repository to your machine using the following command:

```sh
git clone https://github.com/Ketz-dev/discord.js-template-typescript.git
```

2. **Install dependencies:** Run the following command from the project's root folder:

```sh
npm install
```

3. **Setup up a bot application:** If you have already made an application for your bot, skip this step. Otherwise, see this [page](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) on how to setup a bot application.

4. **Setup environment variables:** Change the values in the `.env` file to the appropriate values:

- `BOT_TOKEN` - your bot application's token
- `GUILD_ID` - your test server's id
- `CLIENT_ID` - your bot's user id

5. **Start the development server:**

```sh
npm run start
```

## Project structure

```
├───src/                                Source code goes here
│   ├───commands/                       Application commands go here
│   │   ├───test/                       
│   │   │   └───ping.ts
│   ├───events/                         Client events go here
│   │   ├───command-execute.ts
│   │   └───launch.ts
│   ├───Structures/                     Object structures go here
│   │   ├───Client.ts                   Application client
│   │   ├───Command.ts                  Application command
│   │   └───Event.ts                    Client event
│   ├───util                            Utility functions and types go here
│   │   └───FS.ts                       File System helpers
│   └───index.ts                        Main entry point
├───.env                                Environment variables go here
├───.gitignore                          Files that should not be pushed to the repo
├───env.d.ts                            Environment variable declarations go here                 
├───package.json                        Project scripts, dependencies, and metadata
└───tsconfig.json                       Typescript configuration file
```

## Typescript

You can configure the Typescript compiler in `tsconfig.json`. To keep the codebase safe, the `strict` flag is set to true. Feel free to disable this flag and add your preferred configurations.

## Logging

Logging is all handled by [winston](https://www.npmjs.com/package/winston). If you would like to change the format of your logs, feel free to change the `format` property to your preferrences at `Logger.ts`

```ts
Logger.info('did X.')
Logger.warn('Y is missing.')
Logger.error('Z is of invalid format')
```

## NPM scripts

A brief description of the scripts you'll find in `package.json`:

- `start` - Starts the development server. Use it to test your bot during development.
- `build` - Generates the production build in the `build/` folder located in the project's root.

---

**Enjoy making Discord bots! :)**
