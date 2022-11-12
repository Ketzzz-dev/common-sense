import 'dotenv/config'
import { CommonSenseClient } from './structs/CommonSenseClient'

const CLIENT = new CommonSenseClient

CLIENT.start()