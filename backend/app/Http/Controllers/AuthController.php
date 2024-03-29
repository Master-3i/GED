<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use App\Models\PackUser;
use App\Models\ResetPassword;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

        $makeDir = Storage::disk('local')->makeDirectory($user->_id);


        if (!$user) return response("Something went wrong, please try again ", 400);

        $newPackUser = new PackUser;
        $newPackUser->user_storage = 0;
        $newPackUser->user_group = 0;
        $newPackUser->status = "free";
        $newPackUser->pack()->associate(Pack::where("package_name", "Free")->first());
        $newPackUser->user()->associate($user);

        $createPackUser = $newPackUser->save();
        if (!$createPackUser) return response("Something went Wrong", 400);

        $pack = Pack::where("_id", $newPackUser->pack_id)->first();

        $token = $user->createToken("GED_GID")->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token,
            'userPack' => $newPackUser,
            "pack" => $pack
        ];

        return response($response, 201)->cookie("gid", $token);
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


        $userPack = PackUser::where("user_id", $user->_id)->first();

        $pack = Pack::where("_id", $userPack->pack_id)->first();

        return response(['user' => $user, 'token' => $token, "userPack" => $userPack, "pack" => $pack], 200)->cookie("gid", $token);
    }


    public function logout(Request $request)
    {

        echo $request->user();

        $request->user()->currentAccessToken()->delete();

        return response('logout', 200)->withoutCookie("gid");
    }


    public function sendPasswordLink(Request $request)
    {
        $validate = $request->validate([
            'email' => 'required|email'
        ]);


        $user = User::where('email', $validate['email'])->first();
        if (!$user) return response(['message' => 'No account under this email', 'code' => 'NO_ACCOUNT'], 400);

        //delete all existing reset_password documents

        ResetPassword::where('user_id', $user->_id)->delete();

        $random_token = Str::random(16);
        $expiration = Date::now()->addMinutes(30);
        $sendToken = new ResetPassword();
        $sendToken->expiration = $expiration;
        $sendToken->token = $random_token;
        $sendToken->user()->associate($user);

        $saveToken = $sendToken->save();

        if (!$saveToken) return response('Error during saving token', 400);

        $TO_NAME = $user->first_name . " " . $user->last_name;
        $TO_EMAIL = $user->email;

        $data = array('name' => 'no-reply (GED APP)', 'body' => 'Link to reset password : http://localhost:3000/resetpassword?t=' . $random_token . "&uid=" . $user->_id);


        Mail::send('emails.mail', $data, function ($message) use ($TO_NAME, $TO_EMAIL) {
            $message->to($TO_EMAIL, $TO_NAME)->subject('RESET PASSWORD');
            $message->from('gedmaster3i@gmail.com', 'RESET PASSWORD');
        });

        return response(['message' => 'email sent'], 200);
    }


    public function resetPassword(Request $request)
    {
        //TODO: should check uid and token after we change the password to the new one

        //varify expiration date and the token
        if (!$request->has('t') || !$request->has('uid')) return response(['message' => 'No given info'], 400);
        $checkToken = ResetPassword::where('user_id', $request->query('uid'))->where('token', $request->query('t'))->first();
        if (!$checkToken) return response('invalid token', 400);


        $date_expiration = new Carbon($checkToken->expiration);
        $date_now = new Carbon(Date::now());

        if ($date_now->gt($date_expiration)) return response(['message' => 'verification link is expired', 'code' => 'VERIFICATION_EXPIRED'], 400);
        $validate = $request->validate([
            'password' => 'required|min:8'
        ]);

        $updatePassword = User::where('_id', '=', $request->query('uid'))->first();
        $updatePassword->password = bcrypt($validate['password']);
        $updatePassword->save();


        ResetPassword::where('_id', $checkToken->_id)->delete();

        return response('reset password', 201);
    }


    public function refreshToken(Request $request)
    {

        $oldToken = $request->query("token");
        if (!$oldToken) return response('Unauthorized', 200);
        $tokenId = explode("|", $oldToken)[0];
        $userId = DB::collection("personal_access_tokens")->where("_id", $tokenId)->first()["tokenable_id"];
        $user = User::where("_id", $userId)->first();
        $userPack = PackUser::where("user_id", $user->_id)->first();
        $pack = Pack::where("_id", $userPack->pack_id)->first();
        // $token = $user->tokens()->where('_id', $tokenId)->first();


        // echo $token;


        // return response(['token' => $token], 200)->cookie("gid", $token);
        $response = [
            "user" => $user,
            "userPack" => $userPack,
            "token" => $oldToken,
            "pack" => $pack
        ];
        return response($response, 200)->cookie("gid", $oldToken);
    }
}
