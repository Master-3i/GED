<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Group;
use App\Models\Pack;
use App\Models\PackUser;
use App\Models\User;
use Illuminate\Http\Request;

class GroupController extends Controller
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
        $userGroups = Group::where("group_users", "all", [$user->_id])->get();


        return response($userGroups, 200);
    }

    protected function checkGroupName($name, $user)
    {
        $userGroup = Group::where("group_owner_id", $user->_id)->first();
        if ($userGroup) return response("Group name already exist", 404);
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
        $user = $request->user();
        $packUser = PackUser::where("user_id", $user->_id)->first();
        $pack = Pack::where("_id", $packUser->pack_id)->first();


        if (intval(($packUser->user_group) + 1) > intval($pack->group_limit)) return response("You don't have available space to create group", 404);

        // check if group name already exist

        $this->checkGroupName($request->group_name, $user);

        $createGroup = new Group();
        $createGroup->group_name = $request->group_name;
        $userIds = array();
        array_push($userIds, $user->_id);
        if (count($request->users) > 0) {
            foreach ($request->users as $email) {
                if (\filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $singleUser = User::where("email", $email)->first();
                    if ($singleUser) {
                        array_push($userIds, $singleUser->_id);
                    }
                }
            }
        }
        $createGroup->group_users = $userIds;
        $createGroup->group_owner()->associate($user);

        $createGroup->save();

        // update pack user 

        $packUser->user_group = intval($packUser->user_group) + 1;
        $packUser->save();


        $response = [
            "group" => $createGroup,
            "updatedPack" => $packUser
        ];

        return response($response, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        //
        $user = $request->user();
        $group = Group::where("_id", $id)->first();

        if (!$group) return response("No document under this id", 404);

        if (!$this->check_user_group($user->_id, $group->_id)) return response("Not allowed in this group", 404);

        $allGroupDocument = Document::where("document_shared_group", "all", [$id])->get();
        $allUsers = array();
        foreach ($group->group_users as $singleUser) {
            $s = User::where("_id", $singleUser)->first();
            array_push($allUsers, $s);
        }

        $response = [
            "groupDocuments" => $allGroupDocument,
            "group" => $group,
            "users" => $allUsers
        ];

        return response($response, 200);
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


    private function check_user_group($userId, $groupId)
    {
        $checkGroupUser = Group::where("_id", $groupId)->where("group_users", "all", [$userId])->get();
        if ($checkGroupUser) return true;
        return false;
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
        $user = $request->user();
        $group = Group::where("_id", $id)->first();
        if (!$group) return response("Group does not exist", 404);

        $group->delete();

        $packUser = PackUser::where("user_id", $user->_id)->first();

        $packUser->user_group = $packUser->user_group - 1;

        $packUser->save();

        $allDocuments = Document::where("document_shared_group", "all", [$id])->get();

        foreach ($allDocuments as $d) {
            $d->pull("document_shared_group", $id);
            $d->save();
        }

        return response("Group deleted", 200);
    }


    public function groupUser(Request $request, $id)
    {
        $group = Group::where("_id", $id)->first();
        if (!$group) return response("No group under this id", 404);
        $allUser = array();
        foreach ($group->group_users as $user) {
            $s = User::where("_id", $user)->first();
            array_push($s);
        }

        return response(["users" => $allUser], 200);
    }

    public function inviteUser(Request $request, $id, $email)
    {
        $user = User::where("email", $email)->first();
        if (!$user) return response("User does not exist", 404);
        $group = Group::where("_id", $id)->first();
        if (!$group) return response("Group does not exist", 404);
        $group->push("group_users", $user->_id);
        $group->save();

        return response(["user" => $user], 200);
    }

    public function removeUser(Request $request, $userId, $groupId)
    {
        $group = Group::where("_id", $groupId)->first();
        if (!$group) return response("Group does not exist", 404);

        $group->pull("group_users", $userId);
        $group->save();

        return response("Removed", 200);
    }

    public function updateGroupName(Request $request, $id)
    {
        $group = Group::where("_id", $id)->first();
        if (!$group) return response("Group does not exist", 404);
        $group->group_name = $request->name;
        $group->save();

        return response($group, 201);
    }
}
