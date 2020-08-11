'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
| Documentation: http://adonisjs.com/docs/4.1/routing
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Auth
Route.post('join', 'AuthController.join')
Route.post('login', 'AuthController.login')
Route.get('logout', 'AuthController.logout').middleware('auth')
Route.post('password/reset/mail', 'AuthController.sendResetMail')
Route.post('password/reset', 'AuthController.resetPassword')

Route.get('artworks', 'ArtWorkController.index')
Route.post('artwork/create', 'ArtWorkController.store')
Route.post('create/artwork/chapter/:id', 'ArtWorkController.chapter')
Route.patch('artwork/update', 'ArtWorkController.update')
Route.delete('artwork/delete/:id', 'ArtWorkController.destroy')
Route.get('artworks/show', 'ArtWorkController.show')

//EVENTS
Route.post('event/create', 'EventController.store')
Route.patch('event/update', 'EventController.update')
Route.delete('event/delete/:id', 'EventController.destroy')
//COMMENTS
Route.post('comment/artwork', 'ArtWorkController.comment')
//Route.get('comment/artwork','ArtWorkController.showcomment')

//LIKES
Route.post('artwork/like', 'ArtWorkController.congratulate')
Route.post('/pruebon', 'ArtWorkController.tags')


Route.get('search/home/:params', 'SearchController.home')
Route.get('search/artworks/user/:params/:id', 'SearchController.user')

Route.get('categories', 'CategoryController.categories')
Route.get('subcategories', 'CategoryController.subcategories')
Route.get('categories/subcategories/:id', 'CategoryController.getSubcategories')

Route.get('notifications/:id', 'NotificationController.index')
Route.post('notifications/modify', 'NotificationController.update')

//TAGS
Route.get('tags/:params', 'TagController.index')

// PAGE
Route.post(':username', 'UserController.show')
Route.post('user/artworks', 'UserController.artworks')
Route.post('user/favorites', 'UserController.favorites')
Route.post('user/favorites/toggle', 'UserController.toggleFavorite')
Route.post('user/follow', 'UserController.follow')
