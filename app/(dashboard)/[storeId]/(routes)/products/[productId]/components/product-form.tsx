"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Product, Image, Category, Size, Color } from "@prisma/client"; // chama model store com suas propiedades criado no schema.prisma
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Trash } from "lucide-react";
import { Heading } from "@/components/ui/Heading";
import { ApiAlert } from "@/components/ui/api-alert";
import ImageUpload from "@/components/ui/image-upload"
import { AlertModal } from "@/components/modals/alert-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
} from "@/components/ui/form"
import { useOrigin } from "@/hooks/use-origin";


/* formSchema vai validar o campo o label e imageURL que precisa ter no
   mínimo 1 caractere inserido senao vai ocorrer erro na validação do campo
   prop message vai exibir o erro em portugues, por default esta um mensagem ingles
   remover a prop caso não queira e deixar .min(1)  */
const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(), // isFeatured - se o produto esta disponível
    isArchived: z.boolean().default(false).optional()  // isArquived - se o produto NAO esta disponível ou desabilado da loja

});
  
type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
    initialData: Product & {
        images: Image[]
    } | null; 
    categories: Category[];
    sizes: Size[];
    colors: Color[];
}



/* Página BillboardForm é chamada junto com seu storeId quando clicada no
   Button Add New do component BillboardClient */
export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    categories,
    sizes,
    colors
  }) => {

    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
  
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit product' : 'Create product';
    const description = initialData ? 'Edit a produto.' : 'Add a new produto';
    const toastMessage = initialData ? 'Product atualizado.' : 'Product created.';
    const action = initialData ? 'Save changes' : 'Create';
  
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price))
        } : {
            name: '',
            images: [],
            price: 0,
            categoryId: '',
            colorId: '',
            sizeId: '',
            isFeatured: false,
            isArchived: false,
        }
    });
  
    const onSubmit = async (data: ProductFormValues) => {
        try {
           // console.log(data);
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data); // .patch funçao http do tipo PUT
            } else {
                await axios.post(`/api/${params.storeId}/products`, data);
            }
           
            router.refresh();
            router.push(`/${params.storeId}/products`);
            
            toast.success(toastMessage);
        } catch (error: any) {
            toast.error("Algum erro ocorreu."); // aqui vai receber o erro vindo da api/[storeId]/billboards do arquivo route.ts atraves do error.response.data
        } finally {
            setLoading(false);
        }
    };
  
    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`)

            toast.success('Product removido.');
        } catch (error: any) {
            toast.error('Algum erro ocorreu.');
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
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                                <ImageUpload 
                                    value={field.value.map((image) => image.url)} 
                                    disabled={loading} 
                                    onChange={(url) => field.onChange([...field.value, { url }])}
                                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                        />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Product name" {...field} />
                                    </FormControl>
                                    
                                </FormItem>
                            )}
                        />
                             
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                                    </FormControl>
                                    
                                </FormItem>
                            )}
                        />

                        <FormField                  
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                      
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField                  
                            control={form.control}
                            name="sizeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a size" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sizes.map((size) => (
                                                <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                      
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="colorId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Color</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue defaultValue={field.value} placeholder="Select a color" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {colors.map((color) => (
                                        <SelectItem key={color.id} value={color.id}>{color.name}</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                        checked={field.value}
                                        // @ts-ignore
                                        onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                        Featured
                                        </FormLabel>
                                        <FormDescription>
                                        Este produto irá aparecer na home page
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                        checked={field.value}
                                        // @ts-ignore
                                        onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                        Arquived
                                        </FormLabel>
                                        <FormDescription>
                                        Este produto não irá aparecer na loja(store)
                                        </FormDescription>
                                    </div>
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

