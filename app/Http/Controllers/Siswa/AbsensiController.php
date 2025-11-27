<?php

namespace App\Http\Controllers\Siswa;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\Absensi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AbsensiController extends Controller
{
    public function index()
    {
        $siswa = Auth::user()->siswa;
        $absensiToday = $siswa->getAbsensiHariIni();
        
        return Inertia::render('siswa/absensi', [
            'siswa' => $siswa->load('kelas'),
            'absensiToday' => $absensiToday,
        ]);
    }
    
    public function checkIn(Request $request)
    {
        $siswa = Auth::user()->siswa;
        
        // Check if already checked in today
        $existing = $siswa->getAbsensiHariIni();
        if ($existing && $existing->jam_masuk) {
            return back()->with('error', 'Anda sudah melakukan absen masuk hari ini');
        }
        
        $validated = $request->validate([
            'lokasi' => 'nullable|string',
            'foto' => 'nullable|image|max:2048',
        ]);
        
        // Handle photo upload
        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('absensi', 'public');
        }
        
        // Create or update attendance
        $absensi = Absensi::updateOrCreate(
            [
                'siswa_id' => $siswa->id,
                'tanggal' => today(),
            ],
            [
                'jam_masuk' => now(),
                'status' => 'hadir',
                'lokasi_masuk' => $validated['lokasi'] ?? null,
                'foto_masuk' => $fotoPath,
            ]
        );
        
        return back()->with('success', 'Absen masuk berhasil dicatat');
    }
    
    public function checkOut(Request $request)
    {
        $siswa = Auth::user()->siswa;
        
        // Check if already checked in
        $absensi = $siswa->getAbsensiHariIni();
        if (!$absensi || !$absensi->jam_masuk) {
            return back()->with('error', 'Anda belum melakukan absen masuk hari ini');
        }
        
        // Check if already checked out
        if ($absensi->jam_pulang) {
            return back()->with('error', 'Anda sudah melakukan absen pulang hari ini');
        }
        
        $validated = $request->validate([
            'lokasi' => 'nullable|string',
            'foto' => 'nullable|image|max:2048',
        ]);
        
        // Handle photo upload
        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('absensi', 'public');
        }
        
        // Update attendance
        $absensi->update([
            'jam_pulang' => now(),
            'lokasi_pulang' => $validated['lokasi'] ?? null,
            'foto_pulang' => $fotoPath,
        ]);
        
        return back()->with('success', 'Absen pulang berhasil dicatat');
    }
    
    public function riwayat(Request $request)
    {
        $siswa = Auth::user()->siswa;
        
        $query = Absensi::where('siswa_id', $siswa->id);
        
        // Filter by month
        if ($request->bulan) {
            $query->whereMonth('tanggal', $request->bulan);
        }
        
        // Filter by year
        if ($request->tahun) {
            $query->whereYear('tanggal', $request->tahun);
        }
        
        $absensi = $query->orderBy('tanggal', 'desc')
            ->paginate(15)
            ->withQueryString();
        
        // Summary
        $summary = [
            'total' => $query->count(),
            'hadir' => $query->where('status', 'hadir')->count(),
            'izin' => $query->where('status', 'izin')->count(),
            'sakit' => $query->where('status', 'sakit')->count(),
            'alpha' => $query->where('status', 'alpha')->count(),
        ];
        
        return Inertia::render('siswa/riwayat', [
            'absensi' => $absensi,
            'summary' => $summary,
            'filters' => $request->only(['bulan', 'tahun']),
        ]);
    }
}