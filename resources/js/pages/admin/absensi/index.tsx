// resources/js/pages/Admin/Absensi/Index.tsx
import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileSpreadsheet, Search, CheckCircle, XCircle, AlertCircle, UserX } from 'lucide-react';

interface Absensi {
    id: number;
    tanggal: string;
    jam_masuk: string;
    jam_pulang: string | null;
    status: string;
    siswa: {
        nama_lengkap: string;
        nis: string;
        kelas: {
            nama_kelas: string;
        };
    };
}

interface Kelas {
    id: number;
    nama_kelas: string;
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
    kelas: Kelas[];
    summary: Summary;
    filters: {
        tanggal?: string;
        kelas_id?: string;
        status?: string;
        search?: string;
    };
}

export default function AbsensiIndex({ absensi, kelas, summary, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [tanggal, setTanggal] = useState(filters.tanggal || new Date().toISOString().split('T')[0]);
    const [selectedKelas, setSelectedKelas] = useState(filters.kelas_id || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const handleSearch = () => {
        router.get(
            '/admin/absensi',
            {
                search,
                tanggal,
                kelas_id: selectedKelas === '' ? '' : selectedKelas,
                status: selectedStatus === '' ? '' : selectedStatus,
            },
            { preserveState: true }
        );
    };

    const handleExportPdf = () => {
        window.location.href = `/admin/absensi/export/pdf?${new URLSearchParams({
            tanggal,
            kelas_id: selectedKelas,
            status: selectedStatus,
        })}`;
    };

    const handleExportExcel = () => {
        window.location.href = `/admin/absensi/export/excel?${new URLSearchParams({
            tanggal,
            kelas_id: selectedKelas,
            status: selectedStatus,
        })}`;
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

    const summaryCards = [
        {
            title: 'Total Absensi',
            value: summary.total,
            icon: CheckCircle,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Hadir',
            value: summary.hadir,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Izin',
            value: summary.izin,
            icon: AlertCircle,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            title: 'Sakit',
            value: summary.sakit,
            icon: XCircle,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        {
            title: 'Alpha',
            value: summary.alpha,
            icon: UserX,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
        },
    ];

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin/dashboard' },
                { label: 'Absensi', href: '/admin/absensi' },
            ]}
        >
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Data Absensi</h1>
                        <p className="text-gray-500 mt-1">Kelola data absensi siswa</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleExportPdf}>
                            <Download className="mr-2 h-4 w-4" />
                            PDF
                        </Button>
                        <Button variant="outline" onClick={handleExportExcel}>
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Excel
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-5">
                    {summaryCards.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <Input
                                type="date"
                                value={tanggal}
                                onChange={(e) => setTanggal(e.target.value)}
                                className="w-full sm:w-[200px]"
                            />
                            <div className="flex-1">
                                <Input
                                    placeholder="Cari nama atau NIS..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <Select
                                value={selectedKelas === '' ? '__all' : selectedKelas}
                                onValueChange={(val) => setSelectedKelas(val === '__all' ? '' : val)}
                            >
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Semua Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__all">Semua Kelas</SelectItem>
                                    {kelas.map((k) => (
                                        <SelectItem key={k.id} value={k.id.toString()}>
                                            {k.nama_kelas}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={selectedStatus === '' ? '__all' : selectedStatus}
                                onValueChange={(val) => setSelectedStatus(val === '__all' ? '' : val)}
                            >
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__all">Semua Status</SelectItem>
                                    <SelectItem value="hadir">Hadir</SelectItem>
                                    <SelectItem value="izin">Izin</SelectItem>
                                    <SelectItem value="sakit">Sakit</SelectItem>
                                    <SelectItem value="alpha">Alpha</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleSearch}>
                                <Search className="mr-2 h-4 w-4" />
                                Cari
                            </Button>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>NIS</TableHead>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead>Kelas</TableHead>
                                        <TableHead>Jam Masuk</TableHead>
                                        <TableHead>Jam Pulang</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {absensi.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                                Tidak ada data absensi
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        absensi.data.map((a) => (
                                            <TableRow key={a.id}>
                                                <TableCell>{a.tanggal}</TableCell>
                                                <TableCell className="font-medium">{a.siswa.nis}</TableCell>
                                                <TableCell>{a.siswa.nama_lengkap}</TableCell>
                                                <TableCell>{a.siswa.kelas.nama_kelas}</TableCell>
                                                <TableCell>{a.jam_masuk}</TableCell>
                                                <TableCell>{a.jam_pulang || '-'}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(a.status)}`}
                                                    >
                                                        {a.status.toUpperCase()}
                                                    </span>
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
                                                router.get('/admin/absensi', {
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
        </AppLayout>
    );
}