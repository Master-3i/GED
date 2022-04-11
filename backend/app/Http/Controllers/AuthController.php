<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

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

        echo $request->user();

        $request->user()->currentAccessToken()->delete();

        return response('logout', 200);
    }


    public function sendPasswordLink(Request $request)
    {
        $validate = $request->validate([
            'email' => 'required|email'
        ]);


        $user = User::where('email', $validate['email'])->first();
        if (!$user) return response(['message' => 'No account under this email', 'code' => 'NO_ACCOUNT'], 400);

        $TO_NAME = $user->first_name . " " . $user->last_name;
        $TO_EMAIL = $user->email;
        $rand_number = rand(111111, 999999);
        $data = array('name' => 'no-reply (GED APP)', 'body' => 'verification code : ' . $rand_number);

        Mail::send('emails.mail', $data, function ($message) use ($TO_NAME, $TO_EMAIL) {
            $message->to($TO_EMAIL, $TO_NAME)->subject('RESET PASSWORD');
            $message->from('gedmaster3i@gmail.com', 'RESET PASSWORD');
        });

        //TODO:need to store user id and 

        return response(['message' => 'email sent'], 200);
    }


    public function resetPassword(Request $request)
    {
    }
}
