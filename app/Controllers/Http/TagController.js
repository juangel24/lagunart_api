'use strict'

const Tag = use('App/Models/Tag');
class TagController {
	async index({params}){
		const tags = Tag.query().whereRaw('name like ?',params).fetch()
		return tags
	}
}

module.exports = TagController
