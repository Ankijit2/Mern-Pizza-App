import {Router} from 'express'
import { registerController } from '../controllers/usercontroller.js'


const router = Router()


router.route( '/register').post(registerController)

export default router