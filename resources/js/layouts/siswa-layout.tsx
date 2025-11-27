import { useState } from 'react';
import { Link, usePage} from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Home,
    Calendar,
    History,
    Menu,
    X,
    LogOut,
    User,
} from 'lucide-react';
import { Auth } from '@/types';

interface SiswaLayoutProps {
    children: React.ReactNode;
}

interface PageProps {
    auth: Auth;
    siswa?: {
        nama_lengkap: string;
        nis: string;
        kelas?: {
            nama_kelas: string;
        };
    };
     [key: string]: any;
}

export default function SiswaLayout({ children }: SiswaLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { auth, siswa } = usePage<PageProps>().props;
    const { url } = usePage();

    const navigation = [
        { name: 'Dashboard', href: '/siswa/dashboard', icon: Home },
        { name: 'Absensi', href: '/siswa/absensi', icon: Calendar },
        { name: 'Riwayat', href: '/siswa/riwayat', icon: History },
    ];

    const isActive = (href: string) => url.startsWith(href);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div
                className={cn(
                    'fixed inset-0 z-50 bg-gray-900/80 lg:hidden',
                    sidebarOpen ? 'block' : 'hidden'
                )}
                onClick={() => setSidebarOpen(false)}
            />

            <div
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:hidden',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-16 items-center justify-between px-4 border-b">
                    <span className="text-xl font-bold text-blue-600">Siswa Panel</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <nav className="flex-1 space-y-1 px-2 py-4">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'group flex items-center px-3 py-2 text-sm font-medium rounded-md',
                                isActive(item.href)
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            )}
                        >
                            <item.icon
                                className={cn(
                                    'mr-3 h-5 w-5 flex-shrink-0',
                                    isActive(item.href)
                                        ? 'text-blue-600'
                                        : 'text-gray-400 group-hover:text-gray-500'
                                )}
                            />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r overflow-y-auto">
                    <div className="flex items-center h-16 px-4 border-b">
                        <span className="text-xl font-bold text-blue-600">Siswa Panel</span>
                    </div>
                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md',
                                    isActive(item.href)
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        'mr-3 h-5 w-5 flex-shrink-0',
                                        isActive(item.href)
                                            ? 'text-blue-600'
                                            : 'text-gray-400 group-hover:text-gray-500'
                                    )}
                                />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top navbar */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-3">
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-medium">
                                                {siswa?.nama_lengkap || auth.user.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {siswa?.nis}
                                            </span>
                                        </div>
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <User className="h-4 w-4 text-blue-600" />
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium">
                                                {siswa?.nama_lengkap || auth.user.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {auth.user.email}
                                            </p>
                                            {siswa?.kelas && (
                                                <p className="text-xs text-gray-500">
                                                    Kelas: {siswa.kelas.nama_kelas}
                                                </p>
                                            )}
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/profile"
                                            className="cursor-pointer"
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="w-full cursor-pointer text-red-600"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="py-6">
                    <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
        </div>
    );
}