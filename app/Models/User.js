'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  static get hidden () { return ['password'] }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  user_notifications(){
    return this.belongsToMany('App/Models/Notification').pivotTable('notification_receivers').withPivot(['selected','position'])
  }

  events(){
    return this.hasMany('App/Models/Event')
  }

  user_events(){
    return this.belongsToMany('App/Models/Event').pivotTable('user_events').withPivot(['selected', 'position'])
  }

  followers(){
    return this.belongsToMany('App/Models/User').pivotTable('followes').withPivot(['selected','position'])
  }

  sendmsg(){
    return this.hasMany('App/Models/Message','id','sender_id')
  }

  recivmsg(){
    return this.hasMany('App/Models/Message','id','receiver_id')
  }

  artworks(){
    return this.hasMany('App/Models/Artworks','id','user_id')
  }

  congratulations(){
    return this.belongsToMany('App/Models/Artworks').pivotTable('congratulations').withPivot(['selectd','position'])
  }

  favorites(){
    return this.belongsToMany('App/Models/Artworks').pivotTable('user_favorites').withPivot(['selected','position'])
  }

  comments(){
    return this.hasMany('App/Models/Comment', 'id', 'user_id')
  }
}

module.exports = User
