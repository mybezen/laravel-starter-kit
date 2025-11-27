// resources/js/pages/Admin/Kelas/Index.tsx
import { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Kelas {
    id: number;
    nama_kelas: string;
    tingkat: string;
    jurusan: string | null;
    wali_kelas: string | null;
    kapasitas: number;
    siswa_count: number;
}

interface Props {
    kelas: Kelas[];
}

export default function KelasIndex({ kelas }: Props) {
    const { toast } = useToast();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const createForm = useForm({
        nama_kelas: '',
        tingkat: '',
        jurusan: '',
        wali_kelas: '',
        kapasitas: 30,
    });

    const editForm = useForm({
        nama_kelas: '',
        tingkat: '',
        jurusan: '',
        wali_kelas: '',
        kapasitas: 30,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/kelas', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
                toast({ title: 'Kelas berhasil ditambahkan' });
            },
        });
    };

    const handleEdit = (kelas: Kelas) => {
        setEditingKelas(kelas);
        editForm.setData({
            nama_kelas: kelas.nama_kelas,
            tingkat: kelas.tingkat,
            jurusan: kelas.jurusan || '',
            wali_kelas: kelas.wali_kelas || '',
            kapasitas: kelas.kapasitas,
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingKelas) return;
        
        editForm.put(`/admin/kelas/${editingKelas.id}`, {
            onSuccess: () => {
                setEditingKelas(null);
                editForm.reset();
                toast({ title: 'Kelas berhasil diupdate' });
            },
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/kelas/${id}`, {
            onSuccess: () => {
                setDeleteId(null);
                toast({ title: 'Kelas berhasil dihapus' });
            },
            onError: (errors) => {
                toast({
                    title: 'Gagal menghapus kelas',
                    description: errors[0] || 'Kelas tidak bisa dihapus',
                    variant: 'destructive',
                });
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin/dashboard' },
                { label: 'Kelas', href: '/admin/kelas' },
            ]}
        >
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Data Kelas</h1>
                        <p className="text-gray-500 mt-1">Kelola data kelas</p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Kelas
                    </Button>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Kelas</TableHead>
                                        <TableHead>Tingkat</TableHead>
                                        <TableHead>Jurusan</TableHead>
                                        <TableHead>Wali Kelas</TableHead>
                                        <TableHead>Kapasitas</TableHead>
                                        <TableHead>Jumlah Siswa</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {kelas.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                                Tidak ada data kelas
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        kelas.map((k) => (
                                            <TableRow key={k.id}>
                                                <TableCell className="font-medium">{k.nama_kelas}</TableCell>
                                                <TableCell>{k.tingkat}</TableCell>
                                                <TableCell>{k.jurusan || '-'}</TableCell>
                                                <TableCell>{k.wali_kelas || '-'}</TableCell>
                                                <TableCell>{k.kapasitas}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-gray-400" />
                                                        <span>
                                                            {k.siswa_count} / {k.kapasitas}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(k)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDeleteId(k.id)}
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
                    </CardContent>
                </Card>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Kelas</DialogTitle>
                        <DialogDescription>Tambahkan data kelas baru</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-nama">Nama Kelas</Label>
                            <Input
                                id="create-nama"
                                value={createForm.data.nama_kelas}
                                onChange={(e) => createForm.setData('nama_kelas', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-tingkat">Tingkat</Label>
                            <Input
                                id="create-tingkat"
                                value={createForm.data.tingkat}
                                onChange={(e) => createForm.setData('tingkat', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-jurusan">Jurusan</Label>
                            <Input
                                id="create-jurusan"
                                value={createForm.data.jurusan}
                                onChange={(e) => createForm.setData('jurusan', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-wali">Wali Kelas</Label>
                            <Input
                                id="create-wali"
                                value={createForm.data.wali_kelas}
                                onChange={(e) => createForm.setData('wali_kelas', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-kapasitas">Kapasitas</Label>
                            <Input
                                id="create-kapasitas"
                                type="number"
                                value={createForm.data.kapasitas}
                                onChange={(e) => createForm.setData('kapasitas', parseInt(e.target.value))}
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editingKelas !== null} onOpenChange={() => setEditingKelas(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Kelas</DialogTitle>
                        <DialogDescription>Ubah data kelas</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-nama">Nama Kelas</Label>
                            <Input
                                id="edit-nama"
                                value={editForm.data.nama_kelas}
                                onChange={(e) => editForm.setData('nama_kelas', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-tingkat">Tingkat</Label>
                            <Input
                                id="edit-tingkat"
                                value={editForm.data.tingkat}
                                onChange={(e) => editForm.setData('tingkat', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-jurusan">Jurusan</Label>
                            <Input
                                id="edit-jurusan"
                                value={editForm.data.jurusan}
                                onChange={(e) => editForm.setData('jurusan', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-wali">Wali Kelas</Label>
                            <Input
                                id="edit-wali"
                                value={editForm.data.wali_kelas}
                                onChange={(e) => editForm.setData('wali_kelas', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-kapasitas">Kapasitas</Label>
                            <Input
                                id="edit-kapasitas"
                                type="number"
                                value={editForm.data.kapasitas}
                                onChange={(e) => editForm.setData('kapasitas', parseInt(e.target.value))}
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingKelas(null)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                {editForm.processing ? 'Menyimpan...' : 'Update'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Kelas</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus kelas ini? Kelas dengan siswa tidak dapat dihapus.
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