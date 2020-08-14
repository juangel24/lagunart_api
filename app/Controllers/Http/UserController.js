'use strict'
const Artwork = use('App/Models/Artwork')
const Follower = use('App/Models/Follower')
const User = use('App/Models/User')
const Db = use('Database')

class UserController {
  async artworks({ request }) {
    const { artist_id, category_id, subcategory_id, notIn } = request.all()

    const query = Artwork.query().select('artworks.*')
      .join('art_subcategories', 'artworks.art_subcategory_id', 'art_subcategories.id')
      .join('art_categories', 'art_subcategories.art_categories_id', 'art_categories.id')
      .where('artworks.user_id', artist_id)

    if (category_id) {
      query.andWhere('art_categories.id', category_id)
    }
    if (subcategory_id) {
      query.andWhere('artworks.art_subcategory_id', subcategory_id)
    }
    if (notIn) { query.whereNotIn('artworks.id', notIn) }

    return await query.limit(20).orderBy('artworks.updated_at', 'desc').fetch()
  }

  async favorites({ request }) {
    const user = await User.find(request.input('user_id'))
    return await user.favorites().fetch()
  }

  async follow({ request, response }) {
    const data = request.only(['follower', 'user_id'])
    const follower = await Follower.query().where('follower', data.follower)
      .andWhere('user_id', data.user_id).first()
    const followedUser = await User.find(data.user_id)

    if (follower) {
      await followedUser.followers().detach([data.follower])
      return response.send('Dejaste de seguir a ' + followedUser.username)
    }

    await Follower.create(data)
    return response.send('Sigues a ' + followedUser.username)
  }

  async followers({ request }) {
    const user = await User.find(request.input('user_id'))
    return await user.followers().fetch()
  }

  async following({ request }) {
    const user = await User.find(request.input('user_id'))
    return await user.following().fetch()
  }

  async home({ request }) {
    const { artNotIn, user_id } = request.all()
    const user = await User.find(user_id)
    const followingUsers = await user.following().ids()

    let artworks = Artwork.query().select(
        'artworks.*',
        'users.username',
        'users.profile_img'
      ).select(Db.raw(
        'COUNT(congratulations.artwork_id) AS congratulations, '+
        'COUNT(comments.id) AS comments'
        ))
      .join('art_subcategories', 'artworks.art_subcategory_id', 'art_subcategories.id')
      .join('art_categories', 'art_subcategories.art_categories_id', 'art_categories.id')
      .join('users', 'artworks.user_id', 'users.id')
      .leftJoin('congratulations', 'artworks.id', 'congratulations.artwork_id')
      .leftJoin('comments', 'artworks.id', 'comments.artwork_id')
      .whereIn('users.id', followingUsers)

    if (artNotIn) { artworks.whereNotIn('artworks.id', artNotIn) }

    return await artworks.orderBy('artworks.updated_at', 'desc')
    .groupBy('artworks.id').fetch()
  }

  async show({ params, request, response }) {
    const userProfile = await User.findBy('username', params.username)

    // Check if user page exists
    if (!userProfile) { return response.status(404).send('Página no encontrada') }

    userProfile.followers = await userProfile.followers().getCount()
    userProfile.following = await userProfile.following().getCount()

    const user_id = request.input('user_id')
    userProfile.youFollowHim = false

    if (user_id) {
      const user = await User.find(user_id)

      if (user) {
        if (await userProfile.followers().where('follower', user.id).first()) {
          userProfile.youFollowHim = true
        }
      }
    }

    // Categories of art posted by user
    const userArtCategories = await Db.select(
      'art_categories.id as category_id',
      'art_categories.category',
      'art_subcategories.id as subcategory_id',
      'art_subcategories.subcategory'
    ).from('art_categories')
      .join('art_subcategories', 'art_categories.id', 'art_subcategories.art_categories_id')
      .join('artworks', 'art_subcategories.id', 'artworks.art_subcategory_id')
      .join('users', 'artworks.user_id', 'users.id')
      .where('users.id', userProfile.id)
      .groupBy('art_subcategories.id')

    // get user art categories
    let categories = []
    let lastCategoryId = 0
    userArtCategories.forEach(row => {
      if (row.category_id != lastCategoryId) {
        lastCategoryId = row.category_id
        categories.push({
          category_id: row.category_id,
          category: row.category,
          subcategories: []
        })
      }
    })

    // add subcategories
    for (let i = 0; i < categories.length; i++) {
      userArtCategories.forEach(row => {
        if (row.category_id == categories[i].category_id) {
          categories[i].subcategories.push({
            subcategory_id: row.subcategory_id,
            subcategory: row.subcategory
          })
        }
      })
    }

    userProfile.categories = categories

    return userProfile
  }

  async toggleFavorite({ request, response }) {
    const artwork = await Artwork.find(request.input('artwork_id'))
    const user = await User.find(request.input('user_id'))

    if (await user.favorites().where('id', artwork.id).first()) {
      await user.favorites().detach([artwork.id])
      return response.send('Quitaste esta obra de favoritos')
    }
    await user.favorites().attach([artwork.id])
    return response.send('Añadiste esta obra a favoritos')
  }

  //to lo hizo el ioni, cualquier queja o sugerencia, métacla por el clo >:v
  async getusers(){
    const users = await User.query().fetch()
    return users
  }

  // No recuerdo para que iba a ser esta madre
  //async userInfo() { }
}

module.exports = UserController
