'use strict'
const Artwork = use('App/Models/Artwork')
const User = use('App/Models/User')
const Db = use('Database')

class UserController {
  async artworks({ request }) {
    //const { user_id, category, subcategory } = request.all()
    //let query = User.find(user_id).artworks()
  }

  async favorites({ request }) {
    const user = await User.find(request.get('user_id'))
    return await user.favorites().fetch()
  }

  async follow({ request }) {
    //await Follower.create(request.only(['follower', 'followed']))
  }

  async followers({ request }) {
    const user = await User.find(request.input('user_id'))
    return await user.followers().fetch()
  }

  async following({ request }) {
    const user = await User.find(request.input('user_id'))
    return await user.following().fetch()
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
      .innerJoin('art_subcategories', 'art_categories.id', 'art_subcategories.art_categories_id')
      .innerJoin('artworks', 'art_subcategories.id', 'artworks.art_subcategory_id')
      .innerJoin('users', 'artworks.user_id', 'users.id')
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

  async toggleFavorite({ request }) { }

  async userInfo() { }
}

module.exports = UserController
