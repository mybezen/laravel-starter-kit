<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    use HasFactory;

    protected $table = 'kelas';

    protected $fillable = [
        'nama_kelas',
        'tingkat',
        'jurusan',
        'wali_kelas',
        'kapasitas',
    ];

    // Relationships
    public function siswa()
    {
        return $this->hasMany(Siswa::class);
    }

    // Attributes
    public function getJumlahSiswaAttribute(): int
    {
        return $this->siswa()->count();
    }

    public function getSisaTempatAttribute(): int
    {
        return $this->kapasitas - $this->jumlah_siswa;
    }
}