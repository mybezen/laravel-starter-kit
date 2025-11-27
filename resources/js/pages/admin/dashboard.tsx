// resources/js/pages/Admin/Dashboard.tsx
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, School, CheckCircle, XCircle, AlertCircle, UserX } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Stats {
    totalSiswa: number;
    totalKelas: number;
    hadirToday: number;
    izinToday: number;
    sakitToday: number;
    alphaToday: number;
}

interface ChartDataItem {
    tanggal: string;
    hadir: number;
    izin: number;
    sakit: number;
    alpha: number;
}

interface Absensi {
    id: number;
    tanggal: string;
    jam_masuk: string;
    status: string;
    siswa: {
        nama_lengkap: string;
        nis: string;
        kelas: {
            nama_kelas: string;
        };
    };
}

interface Props {
    stats: Stats;
    chartData: ChartDataItem[];
    recentAbsensi: Absensi[];
}

export default function Dashboard({ stats, chartData, recentAbsensi }: Props) {
    const statCards = [
        {
            title: 'Total Siswa',
            value: stats.totalSiswa,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Total Kelas',
            value: stats.totalKelas,
            icon: School,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Hadir Hari Ini',
            value: stats.hadirToday,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Izin Hari Ini',
            value: stats.izinToday,
            icon: AlertCircle,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            title: 'Sakit Hari Ini',
            value: stats.sakitToday,
            icon: XCircle,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        {
            title: 'Alpha Hari Ini',
            value: stats.alphaToday,
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
        <AppLayout breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }]}>
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Selamat datang di Sistem Absensi Siswa</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Grafik Kehadiran 7 Hari Terakhir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="tanggal" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="hadir" stroke="#10b981" name="Hadir" />
                                <Line type="monotone" dataKey="izin" stroke="#f59e0b" name="Izin" />
                                <Line type="monotone" dataKey="sakit" stroke="#f97316" name="Sakit" />
                                <Line type="monotone" dataKey="alpha" stroke="#ef4444" name="Alpha" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Absensi Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentAbsensi.map((absensi) => (
                                <div
                                    key={absensi.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium">{absensi.siswa.nama_lengkap}</p>
                                        <p className="text-sm text-gray-500">
                                            {absensi.siswa.nis} - {absensi.siswa.kelas.nama_kelas}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(absensi.status)}`}
                                        >
                                            {absensi.status.toUpperCase()}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">{absensi.jam_masuk}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}