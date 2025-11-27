<?php

use App\Http\Controllers\Settings\ProfileController as SettingsProfileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [SettingsProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [SettingsProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [SettingsProfileController::class, 'destroy'])->name('profile.destroy');
});

// Redirect after login based on role
Route::middleware(['auth'])->get('/dashboard', function () {
    $user = Auth::user();
    
    return match($user->role) {
        'admin' => redirect()->route('admin.dashboard'),
        'siswa' => redirect()->route('siswa.dashboard'),
        default => abort(403),
    };
})->name('dashboard');

// Admin Routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])
        ->name('dashboard');
    
    // Siswa Management
    Route::resource('siswa', App\Http\Controllers\Admin\SiswaController::class);
    Route::post('siswa/{siswa}/toggle-status', [App\Http\Controllers\Admin\SiswaController::class, 'toggleStatus'])
        ->name('siswa.toggle-status');
    
    // Kelas Management
    Route::resource('kelas', App\Http\Controllers\Admin\KelasController::class);
    
    // Mata Pelajaran Management
    Route::resource('mata-pelajaran', App\Http\Controllers\Admin\MataPelajaranController::class);
    
    // Absensi Management
    Route::get('absensi', [App\Http\Controllers\Admin\AbsensiController::class, 'index'])
        ->name('absensi.index');
    Route::get('absensi/export/pdf', [App\Http\Controllers\Admin\AbsensiController::class, 'exportPdf'])
        ->name('absensi.export.pdf');
    Route::get('absensi/export/excel', [App\Http\Controllers\Admin\AbsensiController::class, 'exportExcel'])
        ->name('absensi.export.excel');
});

// Siswa Routes
Route::middleware(['auth', 'role:siswa'])->prefix('siswa')->name('siswa.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Siswa\DashboardController::class, 'index'])
        ->name('dashboard');
    
    // Absensi
    Route::get('/absensi', [App\Http\Controllers\Siswa\AbsensiController::class, 'index'])
        ->name('absensi.index');
    Route::post('/absensi/check-in', [App\Http\Controllers\Siswa\AbsensiController::class, 'checkIn'])
        ->name('absensi.check-in');
    Route::post('/absensi/check-out', [App\Http\Controllers\Siswa\AbsensiController::class, 'checkOut'])
        ->name('absensi.check-out');
    
    // Riwayat
    Route::get('/riwayat', [App\Http\Controllers\Siswa\AbsensiController::class, 'riwayat'])
        ->name('riwayat');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
