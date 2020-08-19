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

    var artworks = await query.orderBy('artworks.updated_at', 'desc').limit(10).fetch()
    artworks = artworks.rows
    for (let index = 0; index < artworks.length; index++) {
      const art = artworks[index];
      let imgPath = art.path_img
      let file = await Drive.get(imgPath)
      let base64 = Buffer.from(file).toString('base64')

      artworks[index].path_img = base64
    }

    return artworks
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
    return response.json(artwork)

  }


  async showInfoToEdit({auth}) {
    const user = await auth.getUser()
    const findUser = await User.find(user.id)
    const artworks = await findUser.artworks().last()
    return  { artworks } 
  }

  async update({ request }) {
    try {
      const respuesta = request.body.form
      const artwork_id = respuesta.artwork_id
      const artwork = await Artwork.find(artwork_id)
      const { title, description, art_subcategory_id } = request.all()
      const coverImg = respuesta.path_img


      const name = 'artwork' + Math.random() + '.' + respuesta.extension

      await Drive.put('artwork/' + name, Buffer.from(coverImg, 'base64'))
      const path = 'artwork/' + name
      await Drive.get(path)


      artwork.title = title
      artwork.description = description
      artwork.path_img = path
      artwork.extension = respuesta.extension
      artwork.save()
      //ADD CHAPTER TO ARTWORK
      const { title_chapter, content, name2 } = request.all()
      const chapter_artwork = new Chapter()
      if (artwork.art_subcategory_id == 7 || artwork.art_subcategory_id == 8 || artwork.art_subcategory_id == 9 || artwork.art_subcategory_id == 10 || artwork.art_subcategory_id == 11) {
        chapter_artwork.tittle = title_chapter
        chapter_artwork.content = respuesta.content
        chapter_artwork.artwork_id = artwork_id
        chapter_artwork.save()
      }
  
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
  async chapter({ auth, request, response, params }) {
    const artwork = await Artwork.find(params.id)

    const chapter = new Chapter()
    const { title, content } = request.all()
    chapter.tittle = title
    chapter.content = content
    chapter.artwork_id = artwork.id
    const chapter_artwork = await artwork.chapters().getCount()

    const number = chapter_artwork
    chapter.order = number + 1
    chapter.save()
    return response.json(chapter)
  }
  async congratulate({ auth, response, request }) {
    const user = await auth.getUser()
    const artwork_id = request.input('artwork_id')
    const artwork = await Artwork.find(artwork_id)

    const check = await user.congratulations().where('artwork_id', artwork.id).first()

    console.log(user);
    // console.log(artwork_id);
    console.log(artwork);
    console.log(check);

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
    // const artwork_id = request._raw
    // console.log(request._raw);
    // console.log(request.all());
    const artwork_id = request.input('artwork_id')
    console.log('show ', artwork_id);
    const artwork = await Artwork.find(artwork_id)
    artwork.user = await Artwork.query().select('users.username', 'users.profile_img', 'users.cover_img', 'users.name').from ('users')
      .innerJoin('artworks', 'artworks.user_id', 'users.id')
      .where('artworks.id', artwork_id).fetch()

    artwork.comments = await Comment.query().select('comments.*', 'users.username', 'users.profile_img', 'users.cover_img').from('users')
      .innerJoin('comments', 'comments.user_id', 'users.id')
      .where('artwork_id', artwork.id).fetch()
    artwork.commentsCount = await Comment.query().where('artwork_id', artwork.id).getCount()

    artwork.congratulations = await Artwork.query().select("artworks.*", "congratulations.*").from('congratulations')
      .innerJoin('artworks', 'artworks.id', 'congratulations.artwork_id')
      .innerJoin('users', 'congratulations.user_id', 'users.id').fetch()
    artwork.congratulationsCount = await Database.from('congratulations').where('artwork_id',artwork.id).getCount()

    artwork.chapter = await artwork.chapters().where('artwork_id', artwork.id).fetch()
    // console.log(artwork);
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
