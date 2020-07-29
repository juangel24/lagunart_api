'use strict'
const User = use('App/Models/User')
const PasswordReset = use('App/Models/PasswordReset')
const Env = use('Env')
const jwt = require('jws')
const Mail = use('Mail')

class AuthController {
  async join({ auth, request }) {
    const data = request.only([
      'birth', 'email', 'name', 'password', 'username'
    ])

    // if username is already taken
    let user = await User.findBy('username', data.username)
    if (user) return { msg: 'username taken' }

    // if email already exists
    user = await User.findBy('email', data.email)
    if (user) return { msg: 'email taken' }

    user = await User.create(data)
    return this._userWithToken(auth, user)
  }

  async login({ auth, request }) {
    const { username, password } = request.all()

    if (await auth.attempt(username, password)) {
      let user = await User.findBy('username', username)
      return this._userWithToken(auth, user)
    }
  }

  async logout() { await auth.logout() }

  async sendResetMail({ auth, request }) {
    const email = request.email
    const user = await User.findBy('email', email)

    if (!user) {
      return {
        success: true,
        msg: 'Si la dirección de correo es válida, deberías recibir un correo'
      }
    }

    await PasswordReset.query().where('email', email).delete()

    const token = await jwt.sign({ email: email }, Env.get('APP_KEY'), {
      expiresIn: 60 * 60 * 24
    })

    await PasswordReset.create({ email: email, token })

    await Mail.send('emails.password-reset', {}, (message) => {
      message.from('noreply@mail.test')
      message.to(email)
    })
  }

  async _userWithToken(auth, user) {
    Object.assign(user, await auth.generate(user)) // 2nd parameter is the token
    return user
  }
}

module.exports = AuthController
