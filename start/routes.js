'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
| Documentation: http://adonisjs.com/docs/4.1/routing
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('', () => "I'm a practice :)")

// Auth
Route.post('join', 'AuthController.join')
Route.post('login', 'AuthController.login')
Route.get('logout', 'AuthController.logout').middleware('auth')
Route.post('password/reset/mail', 'AuthController.sendResetMail')
Route.post('password/reset', 'AuthController.resetPassword')

Route.post('home', 'UserController.home')
Route.get('usuarios', 'UserController.getusers')
Route.post('cambiar/imagen', 'UserController.cambiar_imagen').middleware('auth')

Route.post('artworks', 'ArtWorkController.index')
Route.post('artwork/create', 'ArtWorkController.store').middleware('auth')
Route.post('artwork/chapter/create/', 'ArtWorkController.chapter').middleware('auth')
Route.patch('artwork/update', 'ArtWorkController.update').middleware('auth')
Route.delete('artwork/delete/:id', 'ArtWorkController.destroy').middleware('auth')
Route.post('artworks/show', 'ArtWorkController.show')
Route.get('artwork/information', 'ArtworkController.showInfoToEdit')
Route.patch('artwork/chapter/update/', 'ArtworkController.update_chapter')
Route.post('artwork/chapters', 'ArtworkController.getChapters')
Route.post('artwork/chapter','ArtworkController.artwork_id')

//EVENTS
Route.post('event/create', 'EventController.store').middleware('auth')
Route.patch('event/update', 'EventController.update').middleware('auth')
Route.delete('event/delete/:id', 'EventController.destroy').middleware('auth')
//COMMENTS
Route.post('comment/artwork', 'ArtWorkController.comment').middleware('auth')
//Route.get('comment/artwork','ArtWorkController.showcomment')

//LIKES
Route.post('artwork/like', 'ArtWorkController.congratulate').middleware('auth')
// Route.post('/pruebon', 'ArtWorkController.tags')
Route.post('/tags', 'ArtWorkController.tags').middleware('auth')

Route.get('search/home/:params', 'SearchController.home')
Route.get('search/artworks/user/:params/:id', 'SearchController.user')

Route.get('categories', 'CategoryController.categories')
Route.get('subcategories', 'CategoryController.subcategories')
Route.get('categories/subcategories/:id', 'CategoryController.getSubcategories')

Route.get('notifications/:id', 'NotificationController.index')
Route.post('notifications/modify', 'NotificationController.update')

//TAGS
Route.get('tags/:params', 'TagController.index')
Route.post('tags/create/', 'ArtworkController.tags')
Route.post('user/artworks/tags', 'TagController.getAllTagsOfArtwork')
//Route.get('tags')
// PAGE
Route.post('user', 'UserController.show')
Route.post('user/artworks', 'UserController.artworks')
Route.post('user/favorites', 'UserController.favorites')
Route.post('user/favorites/toggle', 'UserController.toggleFavorite')
Route.post('user/follow', 'UserController.follow')
Route.post('user/followers', 'UserController.followers')
Route.post('user/following', 'UserController.following')
Route.get('user/notific/:params', 'UserController.notificaciones')
Route.post('user/delete', 'UserController.rmvnot')
