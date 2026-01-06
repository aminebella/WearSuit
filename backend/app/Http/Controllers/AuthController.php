<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller
{
    // user register by collecting typing infos in register forms and validate and store them in DB
    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'shop_name' => 'nullable|string|max:150|required_if:role,admin',
            'city' => 'required|string|max:100',
            'address' => 'nullable|string|max:255',
            'phone' => 'required|string|max:20|unique:users,phone',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:5|max:255',
            'role' => 'required|string|in:admin,user',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'shop_name' => $request->shop_name,
            'city' => $request->city,
            'address' => $request->address,
            'phone' => $request->phone,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,    // default role
        ]);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
        // return response()->json(["message" => "register OK"]);
    }

    // user login by collecting typing infos in login forms and validate and comparing them in DB and see if exit if yes connect them
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:5|max:255'
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }

        $user = User::where('email', $request->email)->first();

        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'message' => 'Logged in successfully',
            'token' => $token,
            'user' => $user
        ], 200);
        // return response()->json(["message" => "logout OK"]);
    }

    // logout after register
    public function logout(Request $request)
    {
        // Delete the token used in this request
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
        // return response()->json(["message" => "User logout"]);
    }
}
