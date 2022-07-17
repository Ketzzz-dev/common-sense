// main entry point

// initialise environment variables.
import 'dotenv/config'
import { TSClient } from './Structures/Client'

const CLIENT = new TSClient()

// bring our bot to life!
CLIENT.start()