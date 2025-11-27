// resources/js/pages/Siswa/Riwayat.tsx
import { useState } from 'react';
import { router } from '@inertiajs/react';
import SiswaLayout from '@/layouts/siswa-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Calendar, Filter } from 'lucide-react';

interface Absensi {
    id: number;
    tanggal: string;
    jam_masuk: string;
    jam_pulang: string | null;
    status: string;
    lokasi_masuk: string | null;
    lokasi_pulang: string | null;
}

interface Summary {
    total: number;
    hadir: number;
    izin: number;
    sakit: number;
    alpha: number;
}

interface PaginatedData {
    data: Absensi[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    absensi: PaginatedData;
    summary: Summary;
    filters: {
        bulan?: string;
        tahun?: string;
    };
}

export default function SiswaRiwayat({ absensi, summary, filters }: Props) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    const [bulan, setBulan] = useState(filters.bulan || currentMonth.toString());
    const [tahun, setTahun] = useState(filters.tahun || currentYear.toString());

    const handleFilter = () => {
        router.get('/siswa/riwayat', { bulan, tahun }, { preserveState: true });
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            hadir: 'bg-green-100 text-green-800',
            izin: 'bg-yellow-100 text-yellow-800',
            sakit: 'bg-orange-100 text-orange-800',
            alpha: 'bg-red-100 text-red-800',
        };
        return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    const months = [
        { value: '1', label: 'Januari' },
        { value: '2', label: 'Februari' },
        { value: '3', label: 'Maret' },
        { value: '4', label: 'April' },
        { value: '5', label: 'Mei' },
        { value: '6', label: 'Juni' },
        { value: '7', label: 'Juli' },
        { value: '8', label: 'Agustus' },
        { value: '9', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' },
    ];

    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const summaryCards = [
        { label: 'Total', value: summary.total, color: 'text-blue-600' },
        { label: 'Hadir', value: summary.hadir, color: 'text-green-600' },
        { label: 'Izin', value: summary.izin, color: 'text-yellow-600' },
        { label: 'Sakit', value: summary.sakit, color: 'text-orange-600' },
        { label: 'Alpha', value: summary.alpha, color: 'text-red-600' },
    ];

    return (
        <SiswaLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Riwayat Absensi</h1>
                    <p className="text-gray-500 mt-1">Lihat riwayat absensi Anda</p>
                </div>

                <div className="grid gap-4 md:grid-cols-5">
                    {summaryCards.map((card) => (
                        <Card key={card.label}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">
                                    {card.label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Daftar Absensi
                            </CardTitle>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Select value={bulan} onValueChange={setBulan}>
                                    <SelectTrigger className="w-full sm:w-[150px]">
                                        <SelectValue placeholder="Bulan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map((month) => (
                                            <SelectItem key={month.value} value={month.value}>
                                                {month.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={tahun} onValueChange={setTahun}>
                                    <SelectTrigger className="w-full sm:w-[120px]">
                                        <SelectValue placeholder="Tahun" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleFilter}>
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Jam Masuk</TableHead>
                                        <TableHead>Jam Pulang</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Lokasi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {absensi.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                                Tidak ada data absensi
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        absensi.data.map((a) => (
                                            <TableRow key={a.id}>
                                                <TableCell className="font-medium">{a.tanggal}</TableCell>
                                                <TableCell>{a.jam_masuk}</TableCell>
                                                <TableCell>{a.jam_pulang || '-'}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(a.status)}`}
                                                    >
                                                        {a.status.toUpperCase()}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-500">
                                                    {a.lokasi_masuk ? (
                                                        <span className="truncate max-w-[200px] block">
                                                            {a.lokasi_masuk}
                                                        </span>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {absensi.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-500">
                                    Menampilkan {absensi.data.length} dari {absensi.total} data
                                </div>
                                <div className="flex gap-2">
                                    {Array.from({ length: absensi.last_page }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={page === absensi.current_page ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() =>
                                                router.get('/siswa/riwayat', {
                                                    ...filters,
                                                    page,
                                                })
                                            }
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </SiswaLayout>
    );
}