<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $user = Auth::user();
                
                // Redirect based on role
                return match($user->role) {
                    'admin' => redirect('/admin/dashboard'),
                    'siswa' => redirect('/siswa/dashboard'),
                    default => redirect('/dashboard'),
                };
            }
        }

        return $next($request);
    }
}
