import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export default async function SetupLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }
    
    // Vai buscar o userId jah cadastrado na tabela store
    const store = await prismadb.store.findFirst({
        where: {
            userId,
        }
    });
    
    /* se User tem um um store, vai ser redirecionado para Dashboard do sistema
        com seu store atual */
    if (store) {
        redirect(`/${store.id}`);
    };

    return (
        <>
            {children}
        </>
    );
};