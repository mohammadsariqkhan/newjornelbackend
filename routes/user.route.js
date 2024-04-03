import express from 'express'
import passport from 'passport'
import { EditorLogin, Login, RegisterUser } from '../controller/user.controller.js'

const router = express.Router()

router.get('/editor', EditorLogin)

router.post('/register', RegisterUser)

router.post('/login', passport.authenticate('local', { session: false }), Login)


export default router
