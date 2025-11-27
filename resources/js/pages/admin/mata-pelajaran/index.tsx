// resources/js/pages/Admin/MataPelajaran/Index.tsx
import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MataPelajaran {
    id: number;
    kode_mapel: string;
    nama_mapel: string;
    guru_pengampu: string | null;
    jam_pelajaran: number;
    deskripsi: string | null;
}

interface Props {
    mataPelajaran: MataPelajaran[];
}

export default function MataPelajaranIndex({ mataPelajaran }: Props) {
    const { toast } = useToast();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingMapel, setEditingMapel] = useState<MataPelajaran | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const createForm = useForm({
        kode_mapel: '',
        nama_mapel: '',
        guru_pengampu: '',
        jam_pelajaran: 2,
        deskripsi: '',
    });

    const editForm = useForm({
        kode_mapel: '',
        nama_mapel: '',
        guru_pengampu: '',
        jam_pelajaran: 2,
        deskripsi: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/mata-pelajaran', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
                toast({ title: 'Mata pelajaran berhasil ditambahkan' });
            },
        });
    };

    const handleEdit = (mapel: MataPelajaran) => {
        setEditingMapel(mapel);
        editForm.setData({
            kode_mapel: mapel.kode_mapel,
            nama_mapel: mapel.nama_mapel,
            guru_pengampu: mapel.guru_pengampu || '',
            jam_pelajaran: mapel.jam_pelajaran,
            deskripsi: mapel.deskripsi || '',
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMapel) return;
        
        editForm.put(`/admin/mata-pelajaran/${editingMapel.id}`, {
            onSuccess: () => {
                setEditingMapel(null);
                editForm.reset();
                toast({ title: 'Mata pelajaran berhasil diupdate' });
            },
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/mata-pelajaran/${id}`, {
            onSuccess: () => {
                setDeleteId(null);
                toast({ title: 'Mata pelajaran berhasil dihapus' });
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin/dashboard' },
                { label: 'Mata Pelajaran', href: '/admin/mata-pelajaran' },
            ]}
        >
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Data Mata Pelajaran</h1>
                        <p className="text-gray-500 mt-1">Kelola data mata pelajaran</p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Mata Pelajaran
                    </Button>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>Nama Mata Pelajaran</TableHead>
                                        <TableHead>Guru Pengampu</TableHead>
                                        <TableHead>Jam Pelajaran</TableHead>
                                        <TableHead>Deskripsi</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mataPelajaran.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                Tidak ada data mata pelajaran
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        mataPelajaran.map((mapel) => (
                                            <TableRow key={mapel.id}>
                                                <TableCell className="font-medium">{mapel.kode_mapel}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="h-4 w-4 text-gray-400" />
                                                        {mapel.nama_mapel}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{mapel.guru_pengampu || '-'}</TableCell>
                                                <TableCell>{mapel.jam_pelajaran} JP</TableCell>
                                                <TableCell className="max-w-xs truncate">
                                                    {mapel.deskripsi || '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(mapel)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDeleteId(mapel.id)}
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
                        <DialogTitle>Tambah Mata Pelajaran</DialogTitle>
                        <DialogDescription>Tambahkan data mata pelajaran baru</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-kode">Kode Mata Pelajaran</Label>
                            <Input
                                id="create-kode"
                                value={createForm.data.kode_mapel}
                                onChange={(e) => createForm.setData('kode_mapel', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-nama">Nama Mata Pelajaran</Label>
                            <Input
                                id="create-nama"
                                value={createForm.data.nama_mapel}
                                onChange={(e) => createForm.setData('nama_mapel', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-guru">Guru Pengampu</Label>
                            <Input
                                id="create-guru"
                                value={createForm.data.guru_pengampu}
                                onChange={(e) => createForm.setData('guru_pengampu', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-jam">Jam Pelajaran</Label>
                            <Input
                                id="create-jam"
                                type="number"
                                value={createForm.data.jam_pelajaran}
                                onChange={(e) => createForm.setData('jam_pelajaran', parseInt(e.target.value))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-deskripsi">Deskripsi</Label>
                            <Textarea
                                id="create-deskripsi"
                                value={createForm.data.deskripsi}
                                onChange={(e) => createForm.setData('deskripsi', e.target.value)}
                                rows={3}
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
            <Dialog open={editingMapel !== null} onOpenChange={() => setEditingMapel(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Mata Pelajaran</DialogTitle>
                        <DialogDescription>Ubah data mata pelajaran</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-kode">Kode Mata Pelajaran</Label>
                            <Input
                                id="edit-kode"
                                value={editForm.data.kode_mapel}
                                onChange={(e) => editForm.setData('kode_mapel', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-nama">Nama Mata Pelajaran</Label>
                            <Input
                                id="edit-nama"
                                value={editForm.data.nama_mapel}
                                onChange={(e) => editForm.setData('nama_mapel', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-guru">Guru Pengampu</Label>
                            <Input
                                id="edit-guru"
                                value={editForm.data.guru_pengampu}
                                onChange={(e) => editForm.setData('guru_pengampu', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-jam">Jam Pelajaran</Label>
                            <Input
                                id="edit-jam"
                                type="number"
                                value={editForm.data.jam_pelajaran}
                                onChange={(e) => editForm.setData('jam_pelajaran', parseInt(e.target.value))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-deskripsi">Deskripsi</Label>
                            <Textarea
                                id="edit-deskripsi"
                                value={editForm.data.deskripsi}
                                onChange={(e) => editForm.setData('deskripsi', e.target.value)}
                                rows={3}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingMapel(null)}>
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
                        <AlertDialogTitle>Hapus Mata Pelajaran</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus mata pelajaran ini? Tindakan ini tidak dapat
                            dibatalkan.
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