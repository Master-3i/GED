<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\PackController;
use App\Http\Controllers\PaymentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
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
    Route::get('/userDocuments', [DocumentController::class, 'userDocuments']);
    Route::delete('/deleteDocument/{id}', [DocumentController::class, 'destroy']);
    Route::put('/updateDocument/{id}', [DocumentController::class, 'update']);
    Route::get('/downloadDocument/{id}', [DocumentController::class, 'download']);
    Route::post("/shareDocument/{id}", [DocumentController::class, 'share']);
    Route::get("/sharedDocumentUser", [DocumentController::class, "userShareDocument"]);
    Route::delete("/removeSharedDocument/{id}", [DocumentController::class, "removeSharedDocument"]);
    Route::get("searchDocument", [DocumentController::class, "search"]);
    Route::post("/group/store", [GroupController::class, "store"]);
    Route::get("/groups", [GroupController::class, "index"]);
    Route::get("/group/{id}", [GroupController::class, "show"]);
    Route::get("/user/removePicure", [UserController::class, "removePicture"]);
    Route::post("/user/updatePicture", [UserController::class, "updatePicture"]);
    Route::post("/user/update", [UserController::class, "update"]);
    Route::post("/user/updatePassword", [UserController::class, "updatePassword"]);
    Route::get("/document/removefromgroup/{documentid}/{goupid}", [DocumentController::class, "removeFromGroup"]);
    Route::get("/group/inviteUser/{id}/{email}", [GroupController::class, "inviteUser"]);
    Route::get("/group/removeUser/{userId}/{groupId}", [GroupController::class, "removeUser"]);
    Route::post("/group/updateGroupName/{id}", [GroupController::class, "updateGroupName"]);
    Route::delete("/group/destroy/{id}", [GroupController::class, "destroy"]);
    Route::get("/billing/UserPack", [BillingController::class, "UserPack"]);
    Route::get("/billing/pack", [BillingController::class, "pack"]);
    Route::get("/pack/packs", [PackController::class, "AllPacks"]);
    Route::post("/history/success", [PaymentController::class, "store"]);
    Route::get("/histories", [PaymentController::class, "index"]);
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
