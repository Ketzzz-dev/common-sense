// this file allows you to access environment variables in your source code.

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // bot secrets
            BOT_TOKEN: string
            MONGO_URI: string

            // development environment
            MODE: 'dev' | 'prod' // 'dev' mode will register the commands to {GUILD_ID} (your test server). While 'prod' will register commands to the application itself.
            GUILD_ID: string
            CLIENT_ID: string

            // constants
            COMMAND_COOLDOWN: string

            // you can add your own environment variables here.
        }
    }
}

// empty export to avoid errors 
export {}