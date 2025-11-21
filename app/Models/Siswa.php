<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Siswa extends Model
{
    use HasFactory;

    protected $table = 'siswa';

    protected $fillable = [
        'user_id',
        'kelas_id',
        'nis',
        'nisn',
        'nama_lengkap',
        'jenis_kelamin',
        'tanggal_lahir',
        'alamat',
        'telepon',
        'nama_ortu',
        'telepon_ortu',
        'foto',
        'status',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function absensi()
    {
        return $this->hasMany(Absensi::class);
    }

    // Helper methods
    public function getAbsensiHariIni()
    {
        return $this->absensi()
            ->whereDate('tanggal', today())
            ->first();
    }

    public function getPersentaseKehadiran($bulan = null)
    {
        $query = $this->absensi();
        
        if ($bulan) {
            $query->whereMonth('tanggal', $bulan);
        }

        $total = $query->count();
        $hadir = $query->where('status', 'hadir')->count();

        return $total > 0 ? round(($hadir / $total) * 100, 2) : 0;
    }
}
