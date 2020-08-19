'use strict'
const Tag = use('App/Models/Tag');
const Db = use('Database')
class TagController {
	async index({ params }) {
		const variable = "%" + params.params + "%"
		const tags = await Tag.query().whereRaw('name like ?', variable).fetch()
		return tags
	}

	async getAllTagsOfArtwork({request}) {
		try {
			const artwork_id = request.input('artwork_id')
			const tagsOfArtwork = await Db.select('tags.name').from('artworks')
			  .join('artworks_has_tags', 'artworks_has_tags.artwork_id', 'artworks.id')
			  .join('tags', 'tags.id', 'artworks_has_tags.tag_id')
			  .where('artworks_has_tags.artwork_id', artwork_id)
	  
			// if (tagsOfArtwork) {
			//   const artworksOfTags = await Db.select('artworks.*').from('artworks')
			// 	.join('artworks_has_tags', 'artworks_has_tags.artwork_id', 'artworks.id')
			// 	.join('tags', 'tags.id', 'artworks_has_tags.tag_id')
			// 	.whereRaw('tags.name = ?', tagsOfArtwork[0].name)
			// 	.orderBy('artworks.views', 'desc')
			// 	.limit(20)
	  
			//   return { tagsOfArtwork, artworksOfTags }
			// }
				return { tagsOfArtwork }
			} catch (error) {
				console.log(error);
		}
	}
}
module.exports = TagController
