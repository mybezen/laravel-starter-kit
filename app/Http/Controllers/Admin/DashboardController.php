<?php

// app/Http/Controllers/Admin/DashboardController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\Absensi;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = today();

        // Statistics
        $totalSiswa = Siswa::where('status', 'aktif')->count();
        $totalKelas = Kelas::count();

        $absensiToday = Absensi::today()->count();
        $hadirToday = Absensi::today()->where('status', 'hadir')->count();
        $izinToday = Absensi::today()->where('status', 'izin')->count();
        $sakitToday = Absensi::today()->where('status', 'sakit')->count();
        $alphaToday = $totalSiswa - $absensiToday;

        // Chart data - last 7 days
        $chartData = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = today()->subDays($i);
            $chartData->push([
                'tanggal' => $date->format('d M'),
                'hadir' => Absensi::whereDate('tanggal', $date)->where('status', 'hadir')->count(),
                'izin' => Absensi::whereDate('tanggal', $date)->where('status', 'izin')->count(),
                'sakit' => Absensi::whereDate('tanggal', $date)->where('status', 'sakit')->count(),
                'alpha' => $totalSiswa - Absensi::whereDate('tanggal', $date)->count(),
            ]);
        }

        // Recent Attendance
        $recentAbsensi = Absensi::with(['siswa.kelas'])
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalSiswa' => $totalSiswa,
                'totalKelas' => $totalKelas,
                'hadirToday' => $hadirToday,
                'izinToday' => $izinToday,
                'sakitToday' => $sakitToday,
                'alphaToday' => $alphaToday,
            ],
            'chartData' => $chartData,
            'recentAbsensi' => $recentAbsensi,
        ]);
    }
}
