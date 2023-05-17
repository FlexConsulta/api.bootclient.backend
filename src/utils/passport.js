const passport = require('passport');
const passportJwt = require('passport-jwt');
const { Strategy, ExtractJwt } = passportJwt;
const { Login } = require('../config/databases');

const authenticate = () => {

    const params = {
        secretOrKey: process.env.ENCODED,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params, async (payload, done) => {
        const user = await Login.find({})
        done(null, user ? { ...payload } : false)
    })

    passport.use(strategy)
    return passport.authenticate('jwt', { session: false })

}

module.exports = { authenticate }