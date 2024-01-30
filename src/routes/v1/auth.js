import { loginUser, registerUser, getPublicKey, getPasswordLogin, refreshToken, logoutUser, changePassword, forgotPassword, resetPassword, userProfile } from '../../controllers/authController'

export const RouterAuth = (path, router) =>
    router.post(path+'/register', registerUser)
        .post(path+'/login', loginUser)
        .get(path+'/publicKey', getPublicKey)
        .get(path+'/profile', userProfile)
        .get(path+'/passwordLogin', getPasswordLogin)
        .post(path+'/refresh', refreshToken)
        .post(path+'/logout', logoutUser)
        .post(path+'/change-password', changePassword)
        .post(path+'/forgot-password', forgotPassword)
        .post(path+'/reset-password', resetPassword)

