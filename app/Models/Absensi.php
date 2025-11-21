<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Absensi extends Model
{
    use HasFactory;

    protected $table = 'absensi';

    protected $fillable = [
        'siswa_id',
        'tanggal',
        'jam_masuk',
        'jam_pulang',
        'status',
        'lokasi_masuk',
        'lokasi_pulang',
        'keterangan',
        'foto_masuk',
        'foto_pulang',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'jam_masuk' => 'datetime',
        'jam_pulang' => 'datetime',
    ];

    // Relationships
    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    // Scopes
    public function scopeToday($query)
    {
        return $query->whereDate('tanggal', today());
    }

    public function scopeByKelas($query, $kelasId)
    {
        return $query->whereHas('siswa', function ($q) use ($kelasId) {
            $q->where('kelas_id', $kelasId);
        });
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeDateRange($query, $start, $end)
    {
        return $query->whereBetween('tanggal', [$start, $end]);
    }

    // Helper methods
    public function canCheckOut(): bool
    {
        return $this->jam_masuk !== null && $this->jam_pulang === null;
    }

    public function getDurasiAttribute(): ?string
    {
        if ($this->jam_masuk && $this->jam_pulang) {
            $diff = $this->jam_masuk->diff($this->jam_pulang);
            return $diff->format('%H jam %I menit');
        }
        return null;
    }
}
