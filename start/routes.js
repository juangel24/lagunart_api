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

Route.get('search/home', 'SearchController.home')
Route.get('search/artworks/user', 'SearchController.user')

Route.get('categories', 'CategoryController.categories')
Route.get('subcategories', 'CategoryController.subcategories')