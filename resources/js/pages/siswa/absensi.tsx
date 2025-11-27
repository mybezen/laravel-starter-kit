// resources/js/pages/Siswa/Absensi.tsx
import { useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import SiswaLayout from '@/layouts/siswa-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Clock, MapPin, Camera, CheckCircle, LogOut as LogOutIcon } from 'lucide-react';

interface Siswa {
    nama_lengkap: string;
    nis: string;
    kelas: {
        nama_kelas: string;
    };
}

interface FlashProps {
    success?: string;
    error?: string;
}

interface AbsensiToday {
    jam_masuk: string;
    jam_pulang: string | null;
    status: string;
    lokasi_masuk: string | null;
    lokasi_pulang: string | null;
}

interface Props {
    siswa: Siswa;
    absensiToday: AbsensiToday | null;
}

export default function SiswaAbsensi({ siswa, absensiToday }: Props) {
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
    const [location, setLocation] = useState<string>('');
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    const checkInForm = useForm({
        lokasi: '',
        foto: null as File | null,
    });

    const checkOutForm = useForm({
        lokasi: '',
        foto: null as File | null,
    });

    const getCurrentLocation = () => {
        setIsGettingLocation(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc = `${position.coords.latitude}, ${position.coords.longitude}`;
                    setLocation(loc);
                    checkInForm.setData('lokasi', loc);
                    checkOutForm.setData('lokasi', loc);
                    setIsGettingLocation(false);
                    toast({ title: 'Lokasi berhasil didapatkan' });
                },
                (error) => {
                    setIsGettingLocation(false);
                    toast({
                        title: 'Gagal mendapatkan lokasi',
                        description: error.message,
                        variant: 'destructive',
                    });
                }
            );
        } else {
            setIsGettingLocation(false);
            toast({
                title: 'Geolocation tidak didukung',
                description: 'Browser Anda tidak mendukung geolocation',
                variant: 'destructive',
            });
        }
    };

    const handleCheckIn = (e: React.FormEvent) => {
        e.preventDefault();
        checkInForm.post('/siswa/absensi/check-in', {
            onSuccess: () => {
                toast({ title: 'Absen masuk berhasil dicatat' });
                checkInForm.reset();
            },
        });
    };

    const handleCheckOut = (e: React.FormEvent) => {
        e.preventDefault();
        checkOutForm.post('/siswa/absensi/check-out', {
            onSuccess: () => {
                toast({ title: 'Absen pulang berhasil dicatat' });
                checkOutForm.reset();
            },
        });
    };

     if (flash?.success) {
        toast({ title: flash.success });
    }

    const canCheckIn = !absensiToday || !absensiToday.jam_masuk;
    const canCheckOut = absensiToday && absensiToday.jam_masuk && !absensiToday.jam_pulang;

    return (
        <SiswaLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Absensi</h1>
                    <p className="text-gray-500 mt-1">Lakukan absensi masuk dan pulang</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className={!canCheckIn ? 'opacity-50' : ''}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-green-600" />
                                Absen Masuk
                            </CardTitle>
                            <CardDescription>
                                {absensiToday && absensiToday.jam_masuk
                                    ? `Anda sudah absen masuk pada ${absensiToday.jam_masuk}`
                                    : 'Lakukan absen masuk sekarang'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {canCheckIn ? (
                                <form onSubmit={handleCheckIn} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="lokasi-masuk">Lokasi</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="lokasi-masuk"
                                                value={checkInForm.data.lokasi}
                                                onChange={(e) => checkInForm.setData('lokasi', e.target.value)}
                                                placeholder="Koordinat GPS (opsional)"
                                                readOnly
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={getCurrentLocation}
                                                disabled={isGettingLocation}
                                            >
                                                <MapPin className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="foto-masuk">Foto (Opsional)</Label>
                                        <Input
                                            id="foto-masuk"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                checkInForm.setData('foto', e.target.files?.[0] || null)
                                            }
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={checkInForm.processing}
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        {checkInForm.processing ? 'Menyimpan...' : 'Absen Masuk'}
                                    </Button>
                                </form>
                            ) : (
                                <div className="text-center py-8">
                                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                                    <p className="text-gray-500">Absen masuk sudah tercatat</p>
                                    <p className="text-sm text-gray-400 mt-1">{absensiToday?.jam_masuk}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className={!canCheckOut ? 'opacity-50' : ''}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LogOutIcon className="h-5 w-5 text-blue-600" />
                                Absen Pulang
                            </CardTitle>
                            <CardDescription>
                                {!absensiToday || !absensiToday.jam_masuk
                                    ? 'Lakukan absen masuk terlebih dahulu'
                                    : absensiToday.jam_pulang
                                      ? `Anda sudah absen pulang pada ${absensiToday.jam_pulang}`
                                      : 'Lakukan absen pulang sekarang'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {canCheckOut ? (
                                <form onSubmit={handleCheckOut} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="lokasi-pulang">Lokasi</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="lokasi-pulang"
                                                value={checkOutForm.data.lokasi}
                                                onChange={(e) => checkOutForm.setData('lokasi', e.target.value)}
                                                placeholder="Koordinat GPS (opsional)"
                                                readOnly
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={getCurrentLocation}
                                                disabled={isGettingLocation}
                                            >
                                                <MapPin className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="foto-pulang">Foto (Opsional)</Label>
                                        <Input
                                            id="foto-pulang"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                checkOutForm.setData('foto', e.target.files?.[0] || null)
                                            }
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={checkOutForm.processing}
                                    >
                                        <LogOutIcon className="mr-2 h-4 w-4" />
                                        {checkOutForm.processing ? 'Menyimpan...' : 'Absen Pulang'}
                                    </Button>
                                </form>
                            ) : (
                                <div className="text-center py-8">
                                    {absensiToday && absensiToday.jam_pulang ? (
                                        <>
                                            <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                                            <p className="text-gray-500">Absen pulang sudah tercatat</p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                {absensiToday.jam_pulang}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-500">Lakukan absen masuk terlebih dahulu</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {absensiToday && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Absensi Hari Ini</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-500">Status</p>
                                    <p className="text-lg font-semibold capitalize">{absensiToday.status}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-500">Jam Masuk</p>
                                    <p className="text-lg font-semibold">
                                        {absensiToday.jam_masuk || '-'}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-500">Jam Pulang</p>
                                    <p className="text-lg font-semibold">
                                        {absensiToday.jam_pulang || '-'}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-500">Lokasi Masuk</p>
                                    <p className="text-lg font-semibold">
                                        {absensiToday.lokasi_masuk || '-'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </SiswaLayout>
    );
}