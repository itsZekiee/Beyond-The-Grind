<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => [
                'required',
                'string',
                'min:11',
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*#?&]/',
                'confirmed'
            ],
            'receives_newsfeed' => 'boolean'
        ], [
            'password.regex' => 'The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'receives_newsfeed' => $validated['receives_newsfeed'] ?? false,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    /**
     * Sign in (or register) a user with a Google ID token obtained from
     * Google Identity Services on the client.
     *
     * The ID token is verified server-side against Google's tokeninfo endpoint
     * (which validates the signature and expiry). We then confirm the audience
     * matches our configured client id before trusting the claims, find-or-create
     * the user, and issue a Sanctum token in the same shape as login/register.
     */
    public function googleSignIn(Request $request)
    {
        $request->validate([
            'credential' => 'required|string',
        ]);

        $response = Http::get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $request->input('credential'),
        ]);

        if (!$response->ok()) {
            throw ValidationException::withMessages([
                'credential' => ['The Google credential is invalid or expired.'],
            ]);
        }

        $payload = $response->json();

        $expectedClientId = config('services.google.client_id');
        if ($expectedClientId && ($payload['aud'] ?? null) !== $expectedClientId) {
            throw ValidationException::withMessages([
                'credential' => ['The Google credential was issued for a different application.'],
            ]);
        }

        if (empty($payload['email'])) {
            throw ValidationException::withMessages([
                'credential' => ['The Google account did not provide an email address.'],
            ]);
        }

        $user = User::where('email', $payload['email'])->first();

        if ($user) {
            // Link the Google identity to the existing account if not already.
            $user->fill([
                'google_id' => $user->google_id ?: ($payload['sub'] ?? null),
                'avatar' => $user->avatar ?: ($payload['picture'] ?? null),
            ])->save();
        } else {
            $user = User::create([
                'name' => $payload['name'] ?? ($payload['email']),
                'email' => $payload['email'],
                'google_id' => $payload['sub'] ?? null,
                'avatar' => $payload['picture'] ?? null,
                'password' => Hash::make(Str::random(32)),
                'receives_newsfeed' => false,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
