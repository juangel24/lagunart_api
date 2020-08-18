'use strict'
const Artwork = use('App/Models/Artwork')
const Category = use('App/Models/ArtCategory')
const Subcategory = use('App/Models/ArtSubcategory')
const User = use('App/Models/User')
const Comment = use('App/Models/Comment')
const Chapter = use('App/Models/Chapter')
const Tags = use('App/Models/Tag')

const Database = use('Database')
const Drive = use('Drive')
const Helpers = use('Helpers');
const { validate } = use('Validator')

class ArtWorkController {
  async index({ request }) {
    const { category_id, subcategory_id, notIn } = request.all()

    const query = Artwork.queryArt()

    if (category_id) { // filter by category
      query.where('art_categories.id', category_id)
    }
    if (subcategory_id) { // filter by sub-category
      query.where('art_subcategories.id', subcategory_id)
    }
    if (notIn && notIn.length > 0) { // Get more art
      query.whereNotIn('artworks.id', notIn)
    }

    return await query.orderBy('artworks.updated_at', 'desc').limit(10).fetch()
  }

  async store({ auth, request, response }) {
    const user = await auth.getUser();
    const { title, description, art_subcategory_id, is_adult_content, is_private } = request.all()
    const artwork = new Artwork()
    artwork.title = title
    artwork.description = description
    artwork.art_subcategory_id = art_subcategory_id
    artwork.is_adult_content = is_adult_content
    artwork.user_id = user.id

    artwork.is_private = is_private

    await artwork.save()
    console.log(artwork);
    return response.json(artwork)

  }


  async showInfoToEdit({auth}) {
    const user = await auth.getUser()
    const findUser = await User.find(user.id)
    const artworks = await findUser.artworks().last()

      return { artworks }
  }

  async update({ request }) {
    try {
      const respuesta = request.body.form
      const artwork_id = respuesta.artwork_id
      const artwork = await Artwork.find(artwork_id)

      const { title, description, is_adult_content, art_subcategory_id } = request.all()
      const coverImg = respuesta.path_img


      const name = 'artwork' + Math.random() + '.' + respuesta.extension

      await Drive.put('artwork/' + name, Buffer.from(coverImg, 'base64'))
      const path = 'artwork/' + name
      await Drive.get(path)


      artwork.title = title
      artwork.description = description
      artwork.path_img = path
      artwork.is_adult_content = is_adult_content
      artwork.save()

      //ADD CHAPTER TO ARTWORK

      const { title_chapter, content, name2 } = request.all()
      const chapter_artwork = new Chapter()
      if (art_subcategory_id == 7 || art_subcategory_id == 8 || art_subcategory_id == 9 || art_subcategory_id == 10 || art_subcategory_id == 11) {
        chapter_artwork.tittle = title_chapter
        chapter_artwork.content = content
        chapter_artwork.artwork_id = artwork_id
      }
      chapter_artwork.save()
  
      //ADD TAGS TO ARTWORK
      const tags = request.body.tags
      var tag_id = {}
      for (let index = 0; index < tags.length; index++) {
        const data = await Tags.findBy('name', tags[index])
        if (!data) {
          const tag = new Tags()
          tag.name = tags[index]
          tag.save()
        }
        tag_id = await Tags.findBy('name', tags[index])
        await artwork.tags().save(tag_id)
      }
      return { artwork, chapter_artwork, tags }

    } catch (error) {
      console.log(error)
    }
  }

  async congratulate({ auth, response, request }) {
    const user = await auth.getUser()
    const artwork_id = request.input('artwork_id')
    const artwork = await Artwork.find(artwork_id)

    const check = await user.congratulations().where('artwork_id', artwork.id).first()

    if (check) {
      await await user.congratulations().detach(artwork.id)
      return response.send('quitaste tus felicitaciones')
    }
   else {
      await user.congratulations().save(artwork)
      return response.send('felicidades')
    }
  }
  async show({ request }) {
    const artwork_id = request.input('artwork_id')
    const artwork = await Artwork.find(artwork_id)
    artwork.comments = await Comment.query().where('artwork_id', artwork.id).fetch()
    artwork.commentsCount = await Comment.query().where('artwork_id', artwork.id).getCount()

    artwork.congratulations = await Artwork.query().select("artworks.*", "congratulations.*").from('congratulations')
      .innerJoin('artworks', 'artworks.id', 'congratulations.artwork_id')
      .innerJoin('users', 'congratulations.user_id', 'users.id').fetch()
    artwork.congratulationsCount = await Database.from('congratulations').where('artwork_id',artwork.id).getCount()

    artwork.chapter = await artwork.chapters().where('artwork_id', artwork.id).fetch()

    return { artwork }
  }


  async comment({ auth, request, params, response }) {
    const user = await auth.getUser()
    const artwork_id = request.input('artwork_id')
    const artwork = await Artwork.find(artwork_id)

    const comment = new Comment()
    comment.content = request.input('content')
    comment.user_id = user.id
    comment.artwork_id = artwork.id
    comment.save()

    return response.json(comment)
  }

  async stream({ }) {

  }

  async destroy({ params, response }) {
    const artwork = await Artwork.find(params.id)
    await artwork.chapters().delete()
    await artwork.tags().delete()
    await artwork.congratulations().delete()
    await artwork.comments().delete()
    await artwork.delete()
    return response.json({ message: 'Se eliminó la obra' })
  }
  async tags({ request, response }) {
    const artwork_id = request.input('artwork_id')
    const artwork = await Artwork.find(artwork_id)
   
    const name = request.input('name')
    const tag = new Tags()
    tag.name = name
    const data = await Tags.query().fetch()
    const x = data.rows
    for (let i = 0; i < x.length; i++) {
      if (tag.name == x[i].name) {
        console.log(x[i])
        await artwork.tags().save(tag)
        return "Ya existe esa etiqueta"
      } else {
        tag.name = name
      }
    }
    await artwork.tags().save(tag)
    console.log(artwork);
    return response.json(artwork)
  }
}

module.exports = ArtWorkController
