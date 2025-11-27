<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MataPelajaranController extends Controller
{
    public function index()
    {
        $mataPelajaran = MataPelajaran::all();
        
        return Inertia::render('admin/mata-pelajaran/index', [
            'mataPelajaran' => $mataPelajaran,
        ]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_mapel' => 'required|string|unique:mata_pelajaran,kode_mapel',
            'nama_mapel' => 'required|string|max:255',
            'guru_pengampu' => 'nullable|string|max:255',
            'jam_pelajaran' => 'required|integer|min:1',
            'deskripsi' => 'nullable|string',
        ]);
        
        MataPelajaran::create($validated);
        
        return back()->with('success', 'Mata pelajaran berhasil ditambahkan');
    }
    
    public function update(Request $request, MataPelajaran $mataPelajaran)
    {
        $validated = $request->validate([
            'kode_mapel' => 'required|string|unique:mata_pelajaran,kode_mapel,' . $mataPelajaran->id,
            'nama_mapel' => 'required|string|max:255',
            'guru_pengampu' => 'nullable|string|max:255',
            'jam_pelajaran' => 'required|integer|min:1',
            'deskripsi' => 'nullable|string',
        ]);
        
        $mataPelajaran->update($validated);
        
        return back()->with('success', 'Mata pelajaran berhasil diupdate');
    }
    
    public function destroy(MataPelajaran $mataPelajaran)
    {
        $mataPelajaran->delete();
        
        return back()->with('success', 'Mata pelajaran berhasil dihapus');
    }
}