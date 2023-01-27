<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use App\Models\PackUser;
use Illuminate\Http\Request;

class BillingController extends Controller
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

    public function UserPack(Request $request)
    {
        $user = $request->user();
        $userPack = PackUser::where("user_id", $user->_id)->first();
        if (!$userPack) return response("No pack user under this id", 404);

        return response($userPack, 200);
    }


    public function pack(Request $request)
    {
        $user = $request->user();
        $userPack = PackUser::where("user_id", $user->_id)->first();
        if (!$userPack) return response("No pack user under this id", 404);
        $pack = Pack::where("_id", $userPack->pack_id)->first();
        if(!$pack) return response("No pack under this id", 404);

        return response($pack, 200);
    }
}
