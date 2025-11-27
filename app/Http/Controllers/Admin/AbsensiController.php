<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\Siswa;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\AbsensiExport;

class AbsensiController extends Controller
{
    public function index(Request $request)
    {
        $query = Absensi::with(['siswa.kelas']);
        
        // Filter by date
        if ($request->tanggal) {
            $query->whereDate('tanggal', $request->tanggal);
        } else {
            $query->whereDate('tanggal', today());
        }
        
        // Filter by kelas
        if ($request->kelas_id) {
            $query->whereHas('siswa', function ($q) use ($request) {
                $q->where('kelas_id', $request->kelas_id);
            });
        }
        
        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }
        
        // Search by name or NIS
        if ($request->search) {
            $query->whereHas('siswa', function ($q) use ($request) {
                $q->where('nama_lengkap', 'like', '%' . $request->search . '%')
                  ->orWhere('nis', 'like', '%' . $request->search . '%');
            });
        }
        
        $absensi = $query->latest()->paginate(15)->withQueryString();
        $kelas = Kelas::all();
        
        // Summary
        $summary = [
            'total' => Absensi::whereDate('tanggal', $request->tanggal ?? today())->count(),
            'hadir' => Absensi::whereDate('tanggal', $request->tanggal ?? today())->where('status', 'hadir')->count(),
            'izin' => Absensi::whereDate('tanggal', $request->tanggal ?? today())->where('status', 'izin')->count(),
            'sakit' => Absensi::whereDate('tanggal', $request->tanggal ?? today())->where('status', 'sakit')->count(),
            'alpha' => Siswa::where('status', 'aktif')->count() - Absensi::whereDate('tanggal', $request->tanggal ?? today())->count(),
        ];
        
        return Inertia::render('admin/absensi/index', [
            'absensi' => $absensi,
            'kelas' => $kelas,
            'summary' => $summary,
            'filters' => $request->only(['tanggal', 'kelas_id', 'status', 'search']),
        ]);
    }
    
    public function exportPdf(Request $request)
    {
        $query = Absensi::with(['siswa.kelas']);
        
        // Apply same filters
        if ($request->tanggal) {
            $query->whereDate('tanggal', $request->tanggal);
        }
        if ($request->kelas_id) {
            $query->whereHas('siswa', fn($q) => $q->where('kelas_id', $request->kelas_id));
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }
        
        $absensi = $query->get();
        $tanggal = $request->tanggal ?? today()->format('Y-m-d');
        
        $pdf = Pdf::loadView('exports.absensi-pdf', [
            'absensi' => $absensi,
            'tanggal' => $tanggal,
        ]);
        
        return $pdf->download('absensi-' . $tanggal . '.pdf');
    }
    
    public function exportExcel(Request $request)
    {
        $query = Absensi::with(['siswa.kelas']);
        
        // Apply filters
        if ($request->tanggal) {
            $query->whereDate('tanggal', $request->tanggal);
        }
        if ($request->kelas_id) {
            $query->whereHas('siswa', fn($q) => $q->where('kelas_id', $request->kelas_id));
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }
        
        $tanggal = $request->tanggal ?? today()->format('Y-m-d');
        
        return Excel::download(
            new AbsensiExport($query->get()), 
            'absensi-' . $tanggal . '.xlsx'
        );
    }
}