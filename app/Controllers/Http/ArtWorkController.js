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
  async index({
    /*auth*/
    response
  }) {
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
        
      /*const rules = { name: 'required' }
      const validation = await validate(request.all(), rules)*/
    
      await artwork.save()
      console.log(artwork);
      return response.json(artwork)
  }
  async tags({ request, response }) {
    const { name } = request.all()
    const tag = new Tags()
    const data = await Tags.query().fetch()
    for (let i = 0; tag.length; i++){
     if (data) {
       return "Ya existe esa etiqueta"
     } else {
       tag.name = name
     }
  }
    console.log(data.rows);
    //return data
    
    tag.save()
    console.log(tag);
    return response.json(tag)
  }
  async update({ auth, params, request }) {
    const { description, content, } = request.all()

    const validationOptions = { types: ['image'], size: '1mb', extnames: ['png', 'jpg', 'jpeg'] }
    const coverImg = request.file('path_img', validationOptions)
    await coverImg.move(Helpers.tmpPath('artwork'), { name: 'artwork' + Math.random() + '.' + imageFile.clientName, overwrite: true })
    const name = await 'artwork' + Math.random() + '.' + imageFile.clientName
    
    artwork.description = description
    artwork.path_img = name
    artwork.is_adult_content = is_adult_content
    
    
  }
  async chapter({ auth, request, response, params }) {
    const artwork = await Artwork.find(params.id)
    const chapter = new Chapter()
    const { title, content } = request.all()
    chapter.tittle = title
    chapter.content = content
    chapter.artwork_id = artwork.id
    let chapter_artwork = await artwork.chapters().getCount()
    //console.log(chapter_artwork)
    let number = chapter_artwork
    chapter.order = number + 1
    chapter.save()
    return response.json(chapter)
  }
  async congratulate({ }) {
    const user = getUser()
    const artwork = await Artwork.find(params.id)
    const like = new Congratulate()
    like.user_id = user.id
    like.artwork_id = artwork.id
  }
  async show({}) {
  }

  async comment({ auth, request, params, response }) {
    const user = getUser()
    const artwork = await Artwork.find(params.id)

    const comment = new Comment()
    const { content } = request.all()
    comment.content = content
    comment.user_id = user.id
    comment.artwork_id = artwork.id
    comment.save()
    //console.log(comment);
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
