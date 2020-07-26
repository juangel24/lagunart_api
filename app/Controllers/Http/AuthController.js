'use strict'

class AuthController {
  async join({ request, auth }) {
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

  async login({ request, auth }) {
    const { email, password } = request.all()

    if (await auth.attempt(email, password)) {
      let user = await User.findBy('email', email)
      return this._userWithToken(auth, user)
    }
  }

  async logout() { await auth.logout() }

  async _userWithToken(auth, user) {
    Object.assign(user, await auth.generate(user)) // 2nd parameter is the token
    return user
  }
}

module.exports = AuthController
