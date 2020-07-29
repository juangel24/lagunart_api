'use strict'
const Artwork = use('App/Models/Artwork')
const Category = use('App/Models/ArtCategory')
const Subcategory = use('App/Models/ArtSubcategory')
const User = use('App/Models/User')
const Comment = use('App/Models/Comment')
const Chapter = use('App/Models/Chapter')
const Database = use('Database')
const Drive = use('Drive')
const Helpers = use('Helpers');
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
        const validationOptions = {
            types: ['image'],
            size: '1mb',
            extnames: ['png','jpg','jpeg']
        };
        const imageFile = request.file('path_img', validationOptions);
        await imageFile.move(Helpers.tmpPath('artwork'), {
            name: 'artwork' + Math.random() + '.' + imageFile.clientName,
            overwrite: true
        })
        const name = await 'artwork' + Math.random() + '.' + imageFile.clientName

        const { title, description, art_subcategory_id, is_adult_content, view, is_private } = request.all()
        const artwork = new Artwork()
        artwork.title = title
        artwork.description = description
        artwork.art_subcategory_id = art_subcategory_id
        artwork.is_adult_content = is_adult_content
        artwork.user_id = user.id
        artwork.views = view
        artwork.is_private = is_private
        artwork.path_img = name
        await artwork.save()
        console.log(artwork);
        return response.json(artwork)
    }
    async congratulate({}) {

    }
    async show({}) {

    }
    async update({}) {

    }
    async comment({}) {

    }
    async stream({}) {

    }
    async destroy({}) {

    }
  }

  module.exports = ArtWorkController
