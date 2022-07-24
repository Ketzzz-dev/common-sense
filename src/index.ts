import 'dotenv/config'
import CommonSenseClient from './Structures/CommonSenseClient'

const CLIENT = new CommonSenseClient()

CLIENT.start()