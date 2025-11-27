<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function index()
    {
        $kelas = Kelas::withCount('siswa')->get();
        
        return Inertia::render('admin/kelas/index', [
            'kelas' => $kelas,
        ]);
    }
    
    public function create()
    {
        return Inertia::render('admin/kelas/create');
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kelas' => 'required|string|max:255',
            'tingkat' => 'required|string|max:10',
            'jurusan' => 'nullable|string|max:50',
            'wali_kelas' => 'nullable|string|max:255',
            'kapasitas' => 'required|integer|min:1',
        ]);
        
        Kelas::create($validated);
        
        return redirect()->route('admin.kelas.index')
            ->with('success', 'Kelas berhasil ditambahkan');
    }
    
    public function edit(Kelas $kela)
    {
        return Inertia::render('admin/kelas/edit', [
            'kelas' => $kela,
        ]);
    }
    
    public function update(Request $request, Kelas $kela)
    {
        $validated = $request->validate([
            'nama_kelas' => 'required|string|max:255',
            'tingkat' => 'required|string|max:10',
            'jurusan' => 'nullable|string|max:50',
            'wali_kelas' => 'nullable|string|max:255',
            'kapasitas' => 'required|integer|min:1',
        ]);
        
        $kela->update($validated);
        
        return redirect()->route('admin.kelas.index')
            ->with('success', 'Kelas berhasil diupdate');
    }
    
    public function destroy(Kelas $kela)
    {
        if ($kela->siswa()->count() > 0) {
            return back()->with('error', 'Kelas tidak bisa dihapus karena masih memiliki siswa');
        }
        
        $kela->delete();
        
        return redirect()->route('admin.kelas.index')
            ->with('success', 'Kelas berhasil dihapus');
    }
}