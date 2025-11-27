<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        $query = Siswa::with(['kelas', 'user']);
        
        // Search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama_lengkap', 'like', '%' . $request->search . '%')
                  ->orWhere('nis', 'like', '%' . $request->search . '%');
            });
        }
        
        // Filter by kelas
        if ($request->kelas_id) {
            $query->where('kelas_id', $request->kelas_id);
        }
        
        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }
        
        $siswa = $query->paginate(10)->withQueryString();
        $kelas = Kelas::all();
        
        return Inertia::render('admin/siswa/index', [
            'siswa' => $siswa,
            'kelas' => $kelas,
            'filters' => $request->only(['search', 'kelas_id', 'status']),
        ]);
    }
    
    public function create()
    {
        $kelas = Kelas::all();
        
        return Inertia::render('admin/siswa/create', [
            'kelas' => $kelas,
        ]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'nis' => 'required|unique:siswa,nis',
            'nisn' => 'nullable|unique:siswa,nisn',
            'nama_lengkap' => 'required|string|max:255',
            'kelas_id' => 'required|exists:kelas,id',
            'jenis_kelamin' => 'required|in:L,P',
            'tanggal_lahir' => 'nullable|date',
            'alamat' => 'nullable|string',
            'telepon' => 'nullable|string|max:20',
            'nama_ortu' => 'nullable|string|max:255',
            'telepon_ortu' => 'nullable|string|max:20',
            'foto' => 'nullable|image|max:2048',
        ]);
        
        // Create user
        $user = User::create([
            'name' => $validated['nama_lengkap'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'siswa',
        ]);
        
        // Handle photo upload
        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('siswa', 'public');
        }
        
        // Create siswa
        Siswa::create([
            'user_id' => $user->id,
            'kelas_id' => $validated['kelas_id'],
            'nis' => $validated['nis'],
            'nisn' => $validated['nisn'],
            'nama_lengkap' => $validated['nama_lengkap'],
            'jenis_kelamin' => $validated['jenis_kelamin'],
            'tanggal_lahir' => $validated['tanggal_lahir'],
            'alamat' => $validated['alamat'],
            'telepon' => $validated['telepon'],
            'nama_ortu' => $validated['nama_ortu'],
            'telepon_ortu' => $validated['telepon_ortu'],
            'foto' => $fotoPath,
            'status' => 'aktif',
        ]);
        
        return redirect()->route('admin.siswa.index')
            ->with('success', 'Siswa berhasil ditambahkan');
    }
    
    public function edit(Siswa $siswa)
    {
        $siswa->load(['kelas', 'user']);
        $kelas = Kelas::all();
        
        return Inertia::render('admin/siswa/edit', [
            'siswa' => $siswa,
            'kelas' => $kelas,
        ]);
    }
    
    public function update(Request $request, Siswa $siswa)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email,' . $siswa->user_id,
            'nis' => 'required|unique:siswa,nis,' . $siswa->id,
            'nisn' => 'nullable|unique:siswa,nisn,' . $siswa->id,
            'nama_lengkap' => 'required|string|max:255',
            'kelas_id' => 'required|exists:kelas,id',
            'jenis_kelamin' => 'required|in:L,P',
            'tanggal_lahir' => 'nullable|date',
            'alamat' => 'nullable|string',
            'telepon' => 'nullable|string|max:20',
            'nama_ortu' => 'nullable|string|max:255',
            'telepon_ortu' => 'nullable|string|max:20',
            'foto' => 'nullable|image|max:2048',
        ]);
        
        // Update user
        $siswa->user->update([
            'name' => $validated['nama_lengkap'],
            'email' => $validated['email'],
        ]);
        
        // Handle photo upload
        if ($request->hasFile('foto')) {
            if ($siswa->foto) {
                Storage::disk('public')->delete($siswa->foto);
            }
            $validated['foto'] = $request->file('foto')->store('siswa', 'public');
        }
        
        // Update siswa
        $siswa->update($validated);
        
        return redirect()->route('admin.siswa.index')
            ->with('success', 'Siswa berhasil diupdate');
    }
    
    public function destroy(Siswa $siswa)
    {
        if ($siswa->foto) {
            Storage::disk('public')->delete($siswa->foto);
        }
        
        $siswa->user->delete(); // Will cascade delete siswa
        
        return redirect()->route('admin.siswa.index')
            ->with('success', 'Siswa berhasil dihapus');
    }
    
    public function toggleStatus(Siswa $siswa)
    {
        $siswa->update([
            'status' => $siswa->status === 'aktif' ? 'tidak_aktif' : 'aktif'
        ]);
        
        return back()->with('success', 'Status siswa berhasil diubah');
    }
}
