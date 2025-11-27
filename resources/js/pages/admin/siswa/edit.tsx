// resources/js/pages/Admin/Siswa/Edit.tsx
import { useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface Kelas {
    id: number;
    nama_kelas: string;
}

interface Siswa {
    id: number;
    nis: string;
    nisn: string | null;
    nama_lengkap: string;
    kelas_id: number;
    jenis_kelamin: string;
    tanggal_lahir: string | null;
    alamat: string | null;
    telepon: string | null;
    nama_ortu: string | null;
    telepon_ortu: string | null;
    foto: string | null;
    user: {
        email: string;
    };
}

interface Props {
    siswa: Siswa;
    kelas: Kelas[];
}

export default function EditSiswa({ siswa, kelas }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        email: siswa.user.email,
        nis: siswa.nis,
        nisn: siswa.nisn || '',
        nama_lengkap: siswa.nama_lengkap,
        kelas_id: siswa.kelas_id.toString(),
        jenis_kelamin: siswa.jenis_kelamin,
        tanggal_lahir: siswa.tanggal_lahir || '',
        alamat: siswa.alamat || '',
        telepon: siswa.telepon || '',
        nama_ortu: siswa.nama_ortu || '',
        telepon_ortu: siswa.telepon_ortu || '',
        foto: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/siswa/${siswa.id}`);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin/dashboard' },
                { label: 'Siswa', href: '/admin/siswa' },
                { label: 'Edit Siswa', href: `/admin/siswa/${siswa.id}/edit` },
            ]}
        >
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/siswa">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Siswa</h1>
                        <p className="text-gray-500 mt-1">Ubah data siswa {siswa.nama_lengkap}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Akun</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm text-blue-800">
                                        Kosongkan password jika tidak ingin mengubahnya
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Data Siswa</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nis">NIS</Label>
                                    <Input
                                        id="nis"
                                        value={data.nis}
                                        onChange={(e) => setData('nis', e.target.value)}
                                        required
                                    />
                                    {errors.nis && <p className="text-sm text-red-600">{errors.nis}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nisn">NISN</Label>
                                    <Input
                                        id="nisn"
                                        value={data.nisn}
                                        onChange={(e) => setData('nisn', e.target.value)}
                                    />
                                    {errors.nisn && <p className="text-sm text-red-600">{errors.nisn}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                                    <Input
                                        id="nama_lengkap"
                                        value={data.nama_lengkap}
                                        onChange={(e) => setData('nama_lengkap', e.target.value)}
                                        required
                                    />
                                    {errors.nama_lengkap && (
                                        <p className="text-sm text-red-600">{errors.nama_lengkap}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="kelas_id">Kelas</Label>
                                    <Select value={data.kelas_id} onValueChange={(value) => setData('kelas_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kelas.map((k) => (
                                                <SelectItem key={k.id} value={k.id.toString()}>
                                                    {k.nama_kelas}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.kelas_id && (
                                        <p className="text-sm text-red-600">{errors.kelas_id}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                    <Select
                                        value={data.jenis_kelamin}
                                        onValueChange={(value) => setData('jenis_kelamin', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Jenis Kelamin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="L">Laki-laki</SelectItem>
                                            <SelectItem value="P">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.jenis_kelamin && (
                                        <p className="text-sm text-red-600">{errors.jenis_kelamin}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                    <Input
                                        id="tanggal_lahir"
                                        type="date"
                                        value={data.tanggal_lahir}
                                        onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                    />
                                    {errors.tanggal_lahir && (
                                        <p className="text-sm text-red-600">{errors.tanggal_lahir}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Kontak</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="telepon">Telepon</Label>
                                    <Input
                                        id="telepon"
                                        value={data.telepon}
                                        onChange={(e) => setData('telepon', e.target.value)}
                                    />
                                    {errors.telepon && (
                                        <p className="text-sm text-red-600">{errors.telepon}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="alamat">Alamat</Label>
                                    <Textarea
                                        id="alamat"
                                        value={data.alamat}
                                        onChange={(e) => setData('alamat', e.target.value)}
                                        rows={3}
                                    />
                                    {errors.alamat && (
                                        <p className="text-sm text-red-600">{errors.alamat}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Data Orang Tua</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_ortu">Nama Orang Tua/Wali</Label>
                                    <Input
                                        id="nama_ortu"
                                        value={data.nama_ortu}
                                        onChange={(e) => setData('nama_ortu', e.target.value)}
                                    />
                                    {errors.nama_ortu && (
                                        <p className="text-sm text-red-600">{errors.nama_ortu}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telepon_ortu">Telepon Orang Tua/Wali</Label>
                                    <Input
                                        id="telepon_ortu"
                                        value={data.telepon_ortu}
                                        onChange={(e) => setData('telepon_ortu', e.target.value)}
                                    />
                                    {errors.telepon_ortu && (
                                        <p className="text-sm text-red-600">{errors.telepon_ortu}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="foto">Foto</Label>
                                    {siswa.foto && (
                                        <div className="mb-2">
                                            <img
                                                src={`/storage/${siswa.foto}`}
                                                alt="Foto siswa"
                                                className="w-32 h-32 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                    <Input
                                        id="foto"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('foto', e.target.files?.[0] || null)}
                                    />
                                    {errors.foto && <p className="text-sm text-red-600">{errors.foto}</p>}
                                    <p className="text-sm text-gray-500">Kosongkan jika tidak ingin mengubah foto</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Link href="/admin/siswa">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Update'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}