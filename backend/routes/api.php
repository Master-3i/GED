<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\PackController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Models\Document;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/sendResetPasswordLink', [AuthController::class, 'sendPasswordLink']);
Route::post('/auth/resetpassword', [AuthController::class, 'resetPassword']);
Route::get('/auth/refresh', [AuthController::class, 'refreshToken']);


Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/uploadDocument', [DocumentController::class, 'store']);
    Route::get('/userDocuments', [DocumentController::class], 'userDocuments');
});


Route::resource('packs', PackController::class)->only([
    'store', 'update', 'destroy', 'show'
]);




Route::resource('posts', PostController::class)->only([
    'destroy', 'show', 'store', 'update'
]);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
