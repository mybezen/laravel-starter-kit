import SiswaLayout from '@/layouts/siswa-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Calendar, CheckCircle, XCircle, AlertCircle, UserX, Clock } from 'lucide-react';

interface Siswa {
    nama_lengkap: string;
    nis: string;
    kelas: {
        nama_kelas: string;
    };
}

interface AbsensiToday {
    jam_masuk: string;
    jam_pulang: string | null;
    status: string;
}

interface Stats {
    hadir: number;
    izin: number;
    sakit: number;
    alpha: number;
    persentase: number;
}

interface RecentAbsensi {
    tanggal: string;
    jam_masuk: string;
    jam_pulang: string | null;
    status: string;
}

interface Props {
    siswa: Siswa;
    absensiToday: AbsensiToday | null;
    stats: Stats;
    recentAbsensi: RecentAbsensi[];
}

export default function SiswaDashboard({ siswa, absensiToday, stats, recentAbsensi }: Props) {
    const statCards = [
        {
            title: 'Hadir',
            value: stats.hadir,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Izin',
            value: stats.izin,
            icon: AlertCircle,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            title: 'Sakit',
            value: stats.sakit,
            icon: XCircle,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        {
            title: 'Alpha',
            value: stats.alpha,
            icon: UserX,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
        },
    ];

    const getStatusBadge = (status: string) => {
        const badges = {
            hadir: 'bg-green-100 text-green-800',
            izin: 'bg-yellow-100 text-yellow-800',
            sakit: 'bg-orange-100 text-orange-800',
            alpha: 'bg-red-100 text-red-800',
        };
        return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    return (
        <SiswaLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Selamat datang, {siswa.nama_lengkap}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Absensi Hari Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {absensiToday ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Status</span>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(absensiToday.status)}`}
                                        >
                                            {absensiToday.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Jam Masuk</span>
                                        <span className="font-medium">{absensiToday.jam_masuk}</span>
                                    </div>
                                    {absensiToday.jam_pulang && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Jam Pulang</span>
                                            <span className="font-medium">{absensiToday.jam_pulang}</span>
                                        </div>
                                    )}
                                    {!absensiToday.jam_pulang && (
                                        <Link href="/siswa/absensi">
                                            <Button className="w-full mt-2">Absen Pulang</Button>
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500 mb-4">Anda belum melakukan absensi hari ini</p>
                                    <Link href="/siswa/absensi">
                                        <Button>Absen Sekarang</Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Persentase Kehadiran</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center py-8">
                                <div className="relative">
                                    <div className="text-6xl font-bold text-blue-600">{stats.persentase}%</div>
                                    <p className="text-sm text-gray-500 text-center mt-2">Bulan Ini</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    {statCards.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-gray-500 mt-1">Bulan ini</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Absensi Terakhir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentAbsensi.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">Belum ada riwayat absensi</p>
                            ) : (
                                recentAbsensi.map((absensi, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">{absensi.tanggal}</p>
                                            <p className="text-sm text-gray-500">
                                                {absensi.jam_masuk}
                                                {absensi.jam_pulang && ` - ${absensi.jam_pulang}`}
                                            </p>
                                        </div>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(absensi.status)}`}
                                        >
                                            {absensi.status.toUpperCase()}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                        <Link href="/siswa/riwayat">
                            <Button variant="outline" className="w-full mt-4">
                                Lihat Semua Riwayat
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </SiswaLayout>
    );
}