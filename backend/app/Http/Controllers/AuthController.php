<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    //


    public function register(Request $request)
    {
        $validate = $request->validate([
            'first_name' => 'string|max:255|required',
            'last_name' => 'string|max:255|required',
            'email' => 'email|required|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = new User();
        $user->first_name = $validate['first_name'];
        $user->last_name = $validate['last_name'];
        $user->email = $validate['email'];
        $user->password = bcrypt($validate['password']);

        $user->save();

        $token = $user->createToken("GED_GID")->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token
        ];

        return response($response, 201);
    }


    public function login(Request $request)
    {
        $validate = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8'
        ]);

        $user = User::where('email', $validate['email'])->first();

        if (!$user || !Hash::check($validate['password'], $user->password)) return response(['message' => "email or password are incorrect", 'code' => 'INVALID_CREDENTIALS'], 401);

        $token = $user->createToken("GED_GID")->plainTextToken;

        return response(['user' => $user, 'token' => $token], 200);
    }


    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response('logout', 200);
    }
}
