'use strict'
const Artwork = use('App/Models/Artwork')
const Category = use('App/Models/ArtCategory')
const Subcategory = use('App/Models/ArtSubcategory')
const User = use('App/Models/User')
const Comment = use('App/Models/Comment')
const Chapter = use('App/Models/Chapter')
const Database = use('Database')

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
    async store({ /*auth*/ request}) {
        
    }
    async congratulate({ }) {
        
    }
    async show({ }) {
        
    }
    async update({ }) {
        
    }
    async comment({ }) {
        
    }
    async stream({ }) {
        
    }
    async destroy({ }) {
        
    }
}

module.exports = ArtWorkController
