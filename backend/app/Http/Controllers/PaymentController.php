<?php

namespace App\Http\Controllers;

use App\Models\History;
use App\Models\Pack;
use App\Models\PackUser;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
        $user = $request->user();
        $userHistory = History::where("user_id", $user->_id)->get();

        return response($userHistory, 200);
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
        $user = $request->user();
        // update user pack
        $userPack = PackUser::where("user_id", $user->_id)->first();
        $userPack->pack_id = $request->pack_id;
        $userPack->status = "paid";
        $date = Carbon::now();
        switch ($request->m) {
            case 1:
                $date = $date->addMonth();
                break;
            case 6:
                $date = $date->addMonth(6);
                break;
            case 12:
                $date = $date->addYear();
                break;
        }
        $userPack->next_cycle_date = $date;

        $userPack->save();

        $pack = Pack::where("_id", $userPack->pack_id)->first();

        // here goes create history
        $newHistory = new History();
        $newHistory->user()->associate($user);
        $newHistory->pack()->associate($pack);
        $newHistory->order_id = $request->order_id;
        $newHistory->pack = $pack->package_name;
        $newHistory->amount = $request->amount;
        $newHistory->status = "success";

        $newHistory->save();

        echo $date;


        return response($newHistory, 201);
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
