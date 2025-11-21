<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\MataPelajaran;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin
        $admin = User::create([
            'name' => 'Administrator',
            'email' => 'admin@sekolah.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create Kelas
        $kelas = [
            ['nama_kelas' => 'X IPA 1', 'tingkat' => '10', 'jurusan' => 'IPA', 'wali_kelas' => 'Pak Budi', 'kapasitas' => 30],
            ['nama_kelas' => 'X IPA 2', 'tingkat' => '10', 'jurusan' => 'IPA', 'wali_kelas' => 'Bu Ani', 'kapasitas' => 30],
            ['nama_kelas' => 'XI IPA 1', 'tingkat' => '11', 'jurusan' => 'IPA', 'wali_kelas' => 'Pak Doni', 'kapasitas' => 30],
            ['nama_kelas' => 'XI IPS 1', 'tingkat' => '11', 'jurusan' => 'IPS', 'wali_kelas' => 'Bu Sari', 'kapasitas' => 30],
            ['nama_kelas' => 'XII IPA 1', 'tingkat' => '12', 'jurusan' => 'IPA', 'wali_kelas' => 'Pak Agus', 'kapasitas' => 30],
            ['nama_kelas' => 'XII IPS 1', 'tingkat' => '12', 'jurusan' => 'IPS', 'wali_kelas' => 'Bu Tini', 'kapasitas' => 30],
        ];

        foreach ($kelas as $k) {
            Kelas::create($k);
        }

        // Create Mata Pelajaran
        $mapel = [
            ['kode_mapel' => 'MAT', 'nama_mapel' => 'Matematika', 'guru_pengampu' => 'Pak Joko', 'jam_pelajaran' => 4],
            ['kode_mapel' => 'FIS', 'nama_mapel' => 'Fisika', 'guru_pengampu' => 'Pak Anton', 'jam_pelajaran' => 3],
            ['kode_mapel' => 'KIM', 'nama_mapel' => 'Kimia', 'guru_pengampu' => 'Bu Rita', 'jam_pelajaran' => 3],
            ['kode_mapel' => 'BIO', 'nama_mapel' => 'Biologi', 'guru_pengampu' => 'Bu Siti', 'jam_pelajaran' => 3],
            ['kode_mapel' => 'BIN', 'nama_mapel' => 'Bahasa Indonesia', 'guru_pengampu' => 'Bu Nina', 'jam_pelajaran' => 3],
            ['kode_mapel' => 'BING', 'nama_mapel' => 'Bahasa Inggris', 'guru_pengampu' => 'Mr. John', 'jam_pelajaran' => 2],
        ];

        foreach ($mapel as $m) {
            MataPelajaran::create($m);
        }

        // Create Sample Students
        for ($i = 1; $i <= 10; $i++) {
            $user = User::create([
                'name' => "Siswa $i",
                'email' => "siswa$i@sekolah.com",
                'password' => Hash::make('password'),
                'role' => 'siswa',
            ]);

            Siswa::create([
                'user_id' => $user->id,
                'kelas_id' => rand(1, 6),
                'nis' => '2024' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'nisn' => '1234567890' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'nama_lengkap' => "Siswa Nomor $i",
                'jenis_kelamin' => $i % 2 == 0 ? 'L' : 'P',
                'tanggal_lahir' => now()->subYears(16)->subDays(rand(1, 365)),
                'alamat' => "Jalan Pendidikan No. $i",
                'telepon' => '0812345' . str_pad($i, 5, '0', STR_PAD_LEFT),
                'nama_ortu' => "Orang Tua Siswa $i",
                'telepon_ortu' => '0856789' . str_pad($i, 5, '0', STR_PAD_LEFT),
                'status' => 'aktif',
            ]);
        }
    }
}