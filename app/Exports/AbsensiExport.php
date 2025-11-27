<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class AbsensiExport implements FromCollection, WithHeadings, WithMapping
{
    protected $absensi;

    public function __construct($absensi)
    {
        $this->absensi = $absensi;
    }

    public function collection()
    {
        return $this->absensi;
    }

    public function headings(): array
    {
        return [
            'No',
            'NIS',
            'Nama Siswa',
            'Kelas',
            'Tanggal',
            'Jam Masuk',
            'Jam Pulang',
            'Status',
            'Keterangan',
        ];
    }

    public function map($absensi): array
    {
        static $no = 0;
        $no++;

        return [
            $no,
            $absensi->siswa->nis,
            $absensi->siswa->nama_lengkap,
            $absensi->siswa->kelas->nama_kelas ?? '-',
            $absensi->tanggal->format('d/m/Y'),
            $absensi->jam_masuk ? $absensi->jam_masuk->format('H:i') : '-',
            $absensi->jam_pulang ? $absensi->jam_pulang->format('H:i') : '-',
            ucfirst($absensi->status),
            $absensi->keterangan ?? '-',
        ];
    }
}
