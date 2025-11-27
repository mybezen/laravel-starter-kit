<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $siswa = Auth::user()->siswa;

        // Today's attendance
        $absensiToday = $siswa->getAbsensiHariIni();

        // This month stats
        $thisMonth = now()->month;
        $absensiMonth = Absensi::where('siswa_id', $siswa->id)
            ->whereMonth('tanggal', $thisMonth)
            ->get();

        $stats = [
            'hadir' => $absensiMonth->where('status', 'hadir')->count(),
            'izin' => $absensiMonth->where('status', 'izin')->count(),
            'sakit' => $absensiMonth->where('status', 'sakit')->count(),
            'alpha' => $absensiMonth->where('status', 'alpha')->count(),
            'persentase' => $siswa->getPersentaseKehadiran($thisMonth),
        ];

        // Recent attendance (last 7 days)
        $recentAbsensi = Absensi::where('siswa_id', $siswa->id)
            ->orderBy('tanggal', 'desc')
            ->take(7)
            ->get();

        return Inertia::render('siswa/dashboard', [
            'siswa' => $siswa->load('kelas'),
            'absensiToday' => $absensiToday,
            'stats' => $stats,
            'recentAbsensi' => $recentAbsensi,
        ]);
    }
}
