'use strict'
const User = use('App/Models/User')
const PasswordReset = use('App/Models/PasswordReset')
const Env = use('Env')
const jwt = require('jsonwebtoken')
const Mail = use('Mail')

class AuthController {
  async join({ auth, request, response }) {
    const data = request.only([
      'birth', 'email', 'name', 'password', 'username'
    ])

    // if username is already taken
    let user = await User.findBy('username', data.username)
    if (user) { return response.conflict('username') }

    // if email already exists
    user = await User.findBy('email', data.email)
    if (user) { return response.conflict('email') }

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

  async sendResetMail({ request }) {
    const email = request.input('email')
    const user = await User.findBy('email', email)

    if (!user) {
      return {
        success: false,
        message: 'Si la dirección de correo es válida, deberías recibir un correo'
      }
    }

    await PasswordReset.query().where('email', email).delete()

    const token = await jwt.sign({ email: email }, Env.get('APP_KEY'), {
      expiresIn: 60 * 60 * 24
    })

    await PasswordReset.create({ email: email, token })

    const data = { name: user.name, token }

    await Mail.send('email.password-reset', data, (message) => {
      message.from(Env.get('MAIL_USERNAME'))
      message.to(email)
      message.subject('Cambiar contraseña')
    })

    return { success: true, message: 'Te hemos enviado un correo para cambiar contraseña' }
  }

  async resetPassword({ request }) {
    const { password, password_confirm, token } = request.all()

    if (!password) {
      return { success: false, message: 'Escribe una contraseña' }
    }

    if (password_confirm != password) {
      return { success: false, message: 'Las contraseñas no coinciden' }
    }

    var payload
    try {
      payload = jwt.verify(token, Env.get('APP_KEY'))
    } catch (error) {
      if (error) {
        return { success: false, message: 'El link no es válido o ha expirado' }
      }
    }

    const user = await User.findBy('email', payload.email)

    if (!user) { return { success: false, message: 'Usuario no encontrado' } }

    const passwordReset = PasswordReset.query().where('email', user.email)
      .where('token', token).first()

    if (!passwordReset) {
      return { success: false, message: 'Solicitud no encontrada' }
    }

    user.password = password
    await user.save()

    await PasswordReset.query().where('email', user.email)
    .where('token', token).delete()

    return { success: true, message: 'Contraseña cambiada con éxito' }
  }

  async _userWithToken(auth, user) {
    Object.assign(user, await auth.generate(user)) // 2nd parameter is the token
    return user
  }
}

module.exports = AuthController
