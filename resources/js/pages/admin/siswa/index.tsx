// resources/js/pages/Admin/Siswa/Index.tsx
import { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Siswa {
    id: number;
    nis: string;
    nama_lengkap: string;
    jenis_kelamin: string;
    telepon: string;
    status: string;
    kelas: {
        nama_kelas: string;
    };
    user: {
        email: string;
    };
}

interface Kelas {
    id: number;
    nama_kelas: string;
}

interface PaginatedData {
    data: Siswa[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    siswa: PaginatedData;
    kelas: Kelas[];
    filters: {
        search?: string;
        kelas_id?: string;
        status?: string;
    };
}

interface FlashProps {
    success?: string;
    error?: string;
}

export default function SiswaIndex({ siswa, kelas, filters }: Props) {
    const { flash } = usePage().props as { flash?: FlashProps };

    useEffect(() => {
        if (flash?.success) {
            toast({
                title: flash.success,
            });
        }

        if (flash?.error) {
            toast({
                title: "Error",
                description: flash.error,
                variant: "destructive",
            });
        }
    }, [flash]);
    const { toast } = useToast();
    const [search, setSearch] = useState(filters.search || 'all');
    const [selectedKelas, setSelectedKelas] = useState(filters.kelas_id || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleSearch = () => {
        router.get('/admin/siswa', {
            search,
            kelas_id: selectedKelas === 'all' ? '' : selectedKelas,
            status: selectedStatus === 'all' ? '' : selectedStatus,
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/siswa/${id}`, {
            onSuccess: () => {
                setDeleteId(null);
                toast({ title: 'Siswa berhasil dihapus' });
            },
        });
    };

    const handleToggleStatus = (id: number) => {
        router.post(`/admin/siswa/${id}/toggle-status`, {}, {
            onSuccess: () => toast({ title: 'Status siswa berhasil diubah' }),
        });
    };

    if (flash?.success) {
        toast({ title: flash.success });
    }

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin/dashboard' },
                { label: 'Siswa', href: '/admin/siswa' },
            ]}
        >
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Data Siswa</h1>
                        <p className="text-gray-500 mt-1">Kelola data siswa</p>
                    </div>
                    <Link href="/admin/siswa/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Siswa
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="flex-1">
                                <Input
                                    placeholder="Cari nama atau NIS..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <Select value={selectedKelas} onValueChange={setSelectedKelas}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Semua Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kelas</SelectItem>
                                    {kelas.map((k) => (
                                        <SelectItem key={k.id} value={k.id.toString()}>
                                            {k.nama_kelas}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="aktif">Aktif</SelectItem>
                                    <SelectItem value="tidak_aktif">Tidak Aktif</SelectItem>
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
                                        <TableHead>NIS</TableHead>
                                        <TableHead>Nama Lengkap</TableHead>
                                        <TableHead>Kelas</TableHead>
                                        <TableHead>JK</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Telepon</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {siswa.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                                Tidak ada data siswa
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        siswa.data.map((s) => (
                                            <TableRow key={s.id}>
                                                <TableCell className="font-medium">{s.nis}</TableCell>
                                                <TableCell>{s.nama_lengkap}</TableCell>
                                                <TableCell>{s.kelas.nama_kelas}</TableCell>
                                                <TableCell>{s.jenis_kelamin}</TableCell>
                                                <TableCell>{s.user.email}</TableCell>
                                                <TableCell>{s.telepon || '-'}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.status === 'aktif'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}
                                                    >
                                                        {s.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleToggleStatus(s.id)}
                                                        >
                                                            {s.status === 'aktif' ? (
                                                                <ToggleRight className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                                                            )}
                                                        </Button>
                                                        <Link href={`/admin/siswa/${s.id}/edit`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDeleteId(s.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {siswa.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-500">
                                    Menampilkan {siswa.data.length} dari {siswa.total} data
                                </div>
                                <div className="flex gap-2">
                                    {Array.from({ length: siswa.last_page }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={page === siswa.current_page ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() =>
                                                router.get('/admin/siswa', {
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

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Siswa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus siswa ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteId && handleDelete(deleteId)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}