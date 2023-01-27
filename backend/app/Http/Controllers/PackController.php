<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use Illuminate\Http\Request;

class PackController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response(Pack::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validate = $request->validate([
            'package_name' => "required|unique:packs",
            'storage_limit' => "required",
            'group_limit' => "required",
            'price_month' => "required",
            'price_6_month' => "required",
            'price_annually' => "required",
            'features' => "required"
        ]);

        $newPack = new Pack;
        $newPack->package_name = $validate['package_name'];
        $newPack->storage_limit = $validate['storage_limit'];
        $newPack->group_limit = $validate['group_limit'];

        $newPack->price_month = $validate['price_month'];
        $newPack->price_6_month = $validate['price_6_month'];
        $newPack->price_annually = $validate['price_annually'];
        $newPack->features = $validate["features"];

        $storePack = $newPack->save();
        if (!$storePack) return response('Something went wrong', 400);

        return response('Pack saved', 201);
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
        $showPack = Pack::where('_id', $id)->first();
        if (!$showPack) return response('No Pack under this id', 400);
        return response(['pack' => $showPack], 200);
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
        $showPack = Pack::where('_id', $id)->first();
        if (!$showPack) return response('No Pack under this id', 400);

        $validate = $request->validate([
            'package_name' => "required|unique:packs",
            'storage_limit' => "required",
            'group_limit' => "required",
            'price_month' => "required",
            'price_6_month' => "required",
            'price_annually' => "required",
            'features' => "required"
        ]);

        $showPack->package_name = $validate['package_name'];
        $showPack->storage_limit = $validate['storage_limit'];
        $showPack->group_limit = $validate['group_limit'];
        $showPack->price_month = $validate['price_month'];
        $showPack->price_6_month = $validate['price_6_month'];
        $showPack->price_annually = $validate['price_annually'];
        $showPack->features = $validate["features"];


        $updatePack = $showPack->update();

        if (!$updatePack) return response('Something went wrong', 400);

        return response($updatePack, 201);
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
        $showPack = Pack::where('_id', $id)->first();
        if (!$showPack) return response('No Pack under this id', 400);
        $deletePack = $showPack->delete();
        return response($deletePack, 201);
    }

    public function AllPacks()
    {
        $packs = Pack::all();

        return response($packs, 200);
    }
}
