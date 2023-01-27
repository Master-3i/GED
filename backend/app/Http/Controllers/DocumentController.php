<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Pack;
use App\Models\PackUser;
use App\Models\User;
use GuzzleHttp\Psr7\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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


    public function userShareDocument(Request $request)
    {
        $user = $request->user();
        $userShareDocument = Document::where("document_shared_user", "all", [$user->_id])->get();

        return response($userShareDocument, 200);
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
        if ($is_self && ((floatval($pack->storage_limit) * 1024 * 1024 * 1024) < (floatval($userPack->user_storage) * 1024 * 1024 * 1024) + (floatval($size)))) {
            return false;
        }
        return true;
    }

    protected function updateUserPackStorage($size, $user)
    {
        $userPack = PackUser::where("user_id", $user->_id)->first();
        $newUserStorage = round($userPack->user_storage, 4)  + round($size / 1024 / 1024 / 1024, 4);
        $userPack->user_storage = round($newUserStorage, 4);
        $userPack->save();
    }


    protected function freeUserStorage($size, $user)
    {
        $userPack = PackUser::where("user_id", $user->_id)->first();
        $newUserStorage = round($userPack->user_storage, 4)  - round($size / 1024 / 1024 / 1024, 4);
        $userPack->user_storage = round($newUserStorage, 4);
        $userPack->save();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if (!$request->hasFile("document")) return response("No valid file", 400);

        $user = $request->user();

        $info = json_decode($request->info);

        if ($this->checkUserStorage($user, $request->file("document")->getSize(), true)) {

            $newDocument = new Document();
            $path = $request->file("document")->store("/public/" . $user->_id);
            $newDocument->file = [
                "label" => $info->label,
                "ext" => $request->file("document")->extension(),
                "description" => $info->description,
                "size" => $request->file("document")->getSize(),
                "path" => $path,
            ];
            $newDocument->keywords = $request->keywords ? explode(",", $request->keywords) : null;
            $newDocument->is_archived = false;
            $newDocument->is_public = false;
            $newDocument->user()->associate($user);

            $newDocument->save();


            //here should update user storage

            $this->updateUserPackStorage($request->file("document")->getSize(), $user);


            return response($newDocument, 201);
        } else {
            return response(["message" => "not space available for this file", "code" => "NO_SPACE_FILE"], 400);
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
        $oldDocument = Document::where("_id", $id)->first();
        if (!$oldDocument) return response("No document under this id", 404);
        $oldDocument->keywords = $request->keywords;
        $oldDocument->file = ["label" => $request->label ? $request->label : $oldDocument->file["label"], "ext" => $oldDocument->file["ext"], "description" => $request->description ? $request->description : $oldDocument->file["description"], "size" => $oldDocument->file["size"], "path" => $oldDocument->file["path"]];
        $oldDocument->save();

        return response($oldDocument, 201);
    }


    public function share(Request $request, $id)
    {
        $noExist = array();
        $document = Document::where("_id", $id)->first();
        if (!$document) return response("No document under this id", 404);

        foreach ($request->emails as $email) {
            $user = User::where("email", $email)->first();
            if (!$user) {
                array_push($noExist, $email);
                continue;
            } elseif (!in_array($user->_id, $document->document_shared_user ? $document->document_shared_user : [])) {
                $document->push("document_shared_user", $user->_id);
            }
        }

        if (count($request->groups) > 0) {
            $document->document_shared_group = $request->groups;
        }


        $document->save();




        return response(["noExist" => $noExist], 200);
    }


    public function download(Request $request, $id)
    {
        $document = Document::where("_id", $id)->first();
        if (!$document) return response("No document under this id", 404);
        return Storage::download($document->file["path"], $document->file["label"]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        //
        $oldDocument = Document::where("_id", $id)->first();
        $deleteDocument = Document::where("_id", $id)->delete();
        $user = $request->user();
        // here we should delete file from disk
        if ($deleteDocument) {
            Storage::delete($oldDocument->file["path"]);
            $this->freeUserStorage($oldDocument->file["size"], $user);
            return response($deleteDocument, 201);
        } else return response("Something went wrong", 400);
    }



    public function removeSharedDocument(Request $request, $id)
    {
        $document = Document::find($id);
        if (!$document) return response("Document does not exist");
        $document->pull("document_shared_user", $request->user()->_id);

        return response($document, 201);
    }

    public function removeFromGroup(Request $request, $documentid, $groupid)
    {
        $document = Document::where("_id", $documentid)->first();
        if (!$document) return response("Document does not exist", 404);
        $document->pull("document_shared_group", $groupid);
        $document->save();

        return response("document removed from group", 200);
    }


    public function search(Request $request)
    {
        if (!$request->has("q")) return response("No valid query", 404);
        $searchQuery = $request->query("q");
        if (filter_var($searchQuery, FILTER_VALIDATE_EMAIL)) {
            $searchedUser = User::where("email", $searchQuery)->first();
            if ($searchQuery == $searchedUser->email) {
                $allUserDocument = Document::where("user_id", $searchedUser->_id)->get();
                return response($allUserDocument, 200);
            }
            if (!$searchedUser) return response("", 200);
            $allUserDocument = Document::where("user_id", $searchedUser->_id)->where("is_public", true)->get();
            return response($allUserDocument, 200);
        } else {
            $keywords = explode(" ", $searchQuery);
            $oldResult = [];
            $oldResultUser = [];
            foreach ($keywords as $k) {
                $testSearch = Document::where("keywords", "all", [$k])->orWhere("file.label", "like", "%" . $k . "%")->orWhere("file.description", "like", "%" . $k . "%")->get();
                foreach ($testSearch as $t) {
                    $exist = false;
                    foreach ($oldResult as $o) {
                        if ($o->_id == $t->_id) {
                            $exist = true;
                        }
                    }
                    if (!$exist) array_push($oldResult, $t);
                }
            }
            foreach ($keywords as $k) {
                $testSearch = Document::where("user_id", $request->user()->_id)->Where("keywords", "all", [$k])->orWhere("file.label", "like", "%" . $k . "%")->orWhere("file.description", "like", "%" . $k . "%")->get();
                foreach ($testSearch as $t) {
                    $exist = false;
                    foreach ($oldResultUser as $o) {
                        if ($o->_id == $t->_id) {
                            $exist = true;
                        }
                    }
                    if (!$exist) array_push($oldResultUser, $t);
                }
            }

            $response = [
                "user_result" => $oldResultUser,
                "result" => $oldResult
            ];

            return response($response, 200);
        }
    }


    protected function filter_search_result($k, $t, $d, $old)
    {
        $mergedArrays = array_merge($k, $t, $d, $old);
        $result = array_unique($mergedArrays);
        return $result;
    }
}
