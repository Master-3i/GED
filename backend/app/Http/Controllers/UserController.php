<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        //
        $user = $request->user();
        $getUser = User::where("_id", $user->_id)->first();
        if (!$getUser) return response("Something went wrong", 404);
        $getUser->first_name = $request->first_name;
        $getUser->last_name = $request->last_name;
        $getUser->phone_num = $request->phone_num ? $request->phone_num : "";
        $getUser->save();

        return response($getUser, 201);
    }

    public function updatePicture(Request $request)
    {
        if (!$request->hasFile("picture")) return response("No valid file", 400);
        $user = $request->user();
        $getUser = User::where("_id", $user->_id)->first();
        if (!$getUser) return response("Something went wrong", 404);
        // if old picture exist remove it !!
        if ($getUser->picture) {
            Storage::delete($getUser->picture);
        }
        //
        $getUser->picture = $request->file("picture")->store("/public/pictures");
        $getUser->save();

        return response($getUser, 201);
    }


    public function removePicture(Request $request)
    {
        $user = $request->user();
        $getUser = User::where("_id", $user->_id)->first();
        if (!$getUser) return response("Something went wrong", 404);
        $getUser->picture = "";
        Storage::delete($getUser->picture);
        $getUser->save();

        return response($getUser, 201);
    }

    public function updatePassword(Request $request)
    {
        $user = $request->user();
        $getUser = User::where("_id", $user->_id)->first();
        if (!$getUser) return response("Something went wrong", 404);
        if (!Hash::check($request->old, $getUser->password)) return response("Invalid Old Password", 404);
        $getUser->password = bcrypt($request->new);

        $getUser->save();

        return response($getUser, 201);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
