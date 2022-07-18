import 'dotenv/config'
import { CommonSenseClient } from './Structures/Client'

const CLIENT = new CommonSenseClient()

CLIENT.start()