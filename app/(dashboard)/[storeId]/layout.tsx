import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import Navbar from '@/components/navbar'
import prismadb from '@/lib/prismadb';

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: { storeId: string }
}) {
    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const store = await prismadb.store.findFirst({ 
        where: {
        id: params.storeId,
        userId,
        }
    });

    /* se User logado não tiver um store, vai ser redirecionado para página que
       tem o modal para inserir um store */
    if (!store) {
        redirect('/');
    };

    return (
        <>
            <div> <Navbar /> </div>
            {children}
        </>
    );
};