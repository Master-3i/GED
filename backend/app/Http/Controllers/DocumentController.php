<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Pack;
use App\Models\PackUser;
use Illuminate\Http\Request;

class DocumentController extends Controller
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

    public function userDocuments(Request $request)
    {
        $user = $request->user();
        $userDocuments = Document::where("user_id", $user->_id)->get();

        return response(["documents" => $userDocuments], 200);
    }

    /** Upload document
     * @param  \App\Models\User $user
     * @param float $size
     * @param boolean $is_self
     * 
     * @return boolean
     */

    protected function checkUserStorage($user, $size, $is_self)
    {
        $userPack = PackUser::where("user_id", $user->_id)->first();
        $pack = Pack::where("_id", $userPack->pack_id)->first();

        if ($is_self && (floatval($pack->storage_limit) < floatval($userPack->user_storage) + floatval($size))) {
            return false;
        }
        return true;
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
        if (!$request->hasFile("document")) return response("No valid file", 400);
        $user = $request->user();

        if ($this->checkUserStorage($user, $request->file("document")->getSize(), true)) {

            $newDocument = new Document();
            $path = $request->file("document")->store($user->_id);
            $newDocument->file = [
                "label" => $request->file->label,
                "ext" => $request->file("document")->extension(),
                "description" => $request->file->description,
                "path" => $request->file->path,
            ];
            $newDocument->keywords = $request->keywords;
            $newDocument->is_archived = false;
            $newDocument->is_public = false;
        }
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
    public function update(Request $request, $id)
    {
        //
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
