import {Router} from 'express'
import { registerController,emailverifyController,loginController,logoutController,newtokenController } from '../controllers/usercontroller.js'
import { verifyJWT } from '../middleware/authmiddleware.js'



const router = Router()


router.route( '/register').post(registerController)
router.route('/register/:id/verify/:token').get(emailverifyController)
router.route('/login').post(loginController)
router.route('/logout').post(verifyJWT,logoutController)
router.route('/newtoken').get(newtokenController)


export default router