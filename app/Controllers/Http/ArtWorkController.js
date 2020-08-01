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
  async index({ /*auth*/ response }) {
    let index = await Database.select('users.username', 'artworks.tittle', 'artworks.description',
        'art_categories.category', 'art_subcategories.subcategory', 'artworks.is_adult_content',
        'artworks.views', 'artworks.is_private', 'artworks.path_img')
      .from('art_categories')
      .innerJoin('art_subcategories', 'art_subcategories.art_categories_id', 'art_categories.id')
      .innerJoin('artworks', 'artworks.art_subcategory_id', 'art_subcategories.id')
      .innerJoin('users', 'users.id', 'artworks.user_id')
      .orderBy('artworks.id', 'desc')
      .limit(20);
    return response.json(index);
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
    artwork.views = 0
    artwork.is_private = is_private
        
    await artwork.save()
    console.log(artwork);
    return response.json(artwork)
  }
  async update({  request }) {
    const artwork_id = request.input('artwork_id')
    const artwork = await Artwork.find(artwork_id)

    const { title, description, is_adult_content } = request.all()
    const validationOptions = { types: ['image'], size: '1mb', extnames: ['png', 'jpg', 'jpeg'] }
    const coverImg = request.file('path_img', validationOptions)
    await coverImg.move(Helpers.tmpPath('artwork'), { name: 'artwork' + Math.random() + '.' + coverImg.clientName, overwrite: true })
    const name = await 'artwork' + Math.random() + '.' + coverImg.clientName
    
    artwork.title = title
    artwork.description = description
    artwork.path_img = name
    artwork.is_adult_content = is_adult_content
    artwork.save()

    const chapter_artwork = await artwork.chapters().first()
    const { tittle,content} = request.all()
    chapter_artwork.tittle = tittle
    chapter_artwork.content = content
    chapter_artwork.save()

    const tag = new Tags()
    tag.name = request.input('name')
    const data = await Tags.query().fetch()
    const x = data.rows
      for (let i = 0; i < x.length; i++) {
        if (tag.name == x[i].name) {
          console.log(x[i])
          return "Ya existe esa etiqueta"
        }
      }
    tag.save()
    await artwork.tags().save(tag)
    return {artwork, chapter_artwork }
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
  async congratulate({ auth, response, request}) {
    const user = await auth.getUser()
    const artwork_id = request.input('artwork_id')
    const artwork = await Artwork.find(artwork_id)
    const congratulate = await user.congratulations().save(artwork)
    return response.json(congratulate)
  }
  async show({ auth, request }) {
    const user = await auth.getUser()
    const artwork_id = request.input('artwork_id')
    const artwork = await Artwork.find(artwork_id)

    const user_artwork = await Artwork.query().where('user_id', user.id).fetch()
    const comments = await Comment.query().where('artwork_id', artwork.id).fetch()
    const congratulates = await user.congratulations().where('artwork_id', artwork_id).fetch()

    return { user_artwork, comments}
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
  
  async stream({}) {

  }
    async destroy({  params, response}) {
      const artwork = await Artwork.find(params.id)
      await artwork.chapters().delete()
      await artwork.delete()
      return response.json({message:'Se eliminó la obra'})
    }
  }

  module.exports = ArtWorkController
