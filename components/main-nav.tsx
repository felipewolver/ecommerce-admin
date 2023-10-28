"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/${params.storeId}`, // href - link q vai para page /overview - params.storeId q vai abrir a page settings junto com o useId atual 
            label: 'Overview', // Nome da pagina onde vc clica na navbar
            active: pathname === `/${params.storeId}`, // propiedade de controle pra alternar se estah ativo ou não na estilização
        },
        {
            href: `/${params.storeId}/billboards`,
            label: 'Billboards', 
            active: pathname === `/${params.storeId}/billboards`, 
        },
        {
            href: `/${params.storeId}/categories`,
            label: 'Categorias', 
            active: pathname === `/${params.storeId}/categories`, 
        },
        {
            href: `/${params.storeId}/sizes`,
            label: 'Sizes', 
            active: pathname === `/${params.storeId}/sizes`, 
        },
        {
            href: `/${params.storeId}/colors`,
            label: 'Colors', 
            active: pathname === `/${params.storeId}/colors`, 
        },
        {
            href: `/${params.storeId}/products`,
            label: 'Produtos', 
            active: pathname === `/${params.storeId}/products`, 
        },
        {
            href: `/${params.storeId}/orders`,
            label: 'Orders', 
            active: pathname === `/${params.storeId}/orders`, 
        },
        {
            href: `/${params.storeId}/settings`,
            label: 'Settings', 
            active: pathname === `/${params.storeId}/settings`, 
        },

    ]


    return (

        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props} >
            
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        'text-sm font-medium transition-colors hover:text-primary',
                        route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
                    )} >

                {route.label}
                </Link>
            ))}
        </nav>
    );

}

export default MainNav;