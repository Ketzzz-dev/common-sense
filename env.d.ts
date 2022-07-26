declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string
            MONGO_URI: string

            MODE: 'dev' | 'prod'
            GUILD_ID: string
            CLIENT_ID: string
        }
    }
}
 
export {}