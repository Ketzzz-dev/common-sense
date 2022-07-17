// main entry point

// initialise environment variables.
import 'dotenv/config'
import { CommonSenseClient } from './Structures/Client'

const CLIENT = new CommonSenseClient()

// bring our bot to life!
CLIENT.start()