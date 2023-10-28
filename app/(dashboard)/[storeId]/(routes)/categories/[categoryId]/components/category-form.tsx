"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Billboard, Category } from "@prisma/client"; // chama model store com suas propiedades criado no schema.prisma
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Trash } from "lucide-react";
import { Heading } from "@/components/ui/Heading";
import { Select, 
    SelectTrigger, 
    SelectValue, 
    SelectContent,
    SelectItem
} from "@/components/ui/select";
import { AlertModal } from "@/components/modals/alert-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useOrigin } from "@/hooks/use-origin";


/* formSchema vai validar o campo o label e imageURL que precisa ter no
   mínimo 1 caractere inserido senao vai ocorrer erro na validação do campo*/
const formSchema = z.object({
    name: z.string().min(1), 
    billboardId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
    initialData: Category | null; 
    billboards: Billboard[];
}



/* Página BillboardForm é chamada junto com seu storeId quando clicada no
   Button Add New do component BillboardClient */
export const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData, 
    billboards
  }) => {

    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
  
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit category' : 'Create category';
    const description = initialData ? 'Edit a category.' : 'Add a new category';
    const toastMessage = initialData ? 'Category atualizada.' : 'Category created.';
    const action = initialData ? 'Save changes' : 'Create';
  
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            billboardId: ''
        }
    });
  
    const onSubmit = async (data: CategoryFormValues) => {
        try {
           // console.log(data);
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data); // .patch funçao http do tipo PUT
            } else {
                await axios.post(`/api/${params.storeId}/categories`, data);
            }
           
            router.refresh();
            router.push(`/${params.storeId}/categories`);
            
            toast.success(toastMessage);
        } catch (error: any) {
            toast.error('Algum erro ocorreu.');
        } finally {
            setLoading(false);
        }
    };
  
    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            router.refresh();
            router.push(`/${params.storeId}/categories`)

            toast.success('Category removido.');
        } catch (error: any) {
            toast.error('Make sure you removed all categories using this billboard first.');
        } finally {
            setLoading(false);
            setOpen(false);
        }
      }
    
    {/*<Separator /> verifica a origem da rota colocar no final 
            <ApiAlert title="NEXT_PUBLIC_API_URL"  
                description={`${origin}/api/${params.storeId}`}
                variant="public" 
        /> */
    }
    return (
        <>
            <AlertModal 
                isOpen={open} 
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                ) }
            </div>
            
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                        
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Category name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="billboardId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Billboard</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a billboard" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map((billboard) => (
                                                <SelectItem key={billboard.id} value={billboard.id}>{billboard.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                      
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        
        </>
    );
};

