"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { Form,  
    FormControl, 
    FormDescription, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 



/* formSchema vai validar o campo o name que precisa ter no mínimo 1 
   caractere inserido senao vai ocorrer erro na validação do campo. prop message 
   .min(1, { message: "mensagem de erro" }) vai exibir o erro em portugues, 
   por default esta um mensagem ingles remover a prop senão deixar .min(1)  */
const formSchema = z.object({
    name: z.string().min(1)
});


export const StoreModal = () => {
    
    const storeModal = useStoreModal();

    const [loading, setLoading] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        //console.log(values);
        
        try {
            setLoading(true);   //throw new Error(); para teste de erro os codigos abaixo ficam desabilitados com Error

            const response = await axios.post('/api/stores', values); //console.log(response.data); '/api/stores' caminho vindo da pasta /api/stores
            window.location.assign(`/${response.data.id}`); // depois de salvar um store, o location.assign vai passar para url localhost:3000/storeId..

            toast.success('Store registrado.');
          } catch (error) {
            toast.error('Ocorreu um erro!');
          } finally {
            setLoading(false);
        }
    }


    return (

        <Modal title="Criar store" description="Add um novo store para gerenciar produtos e categorias"
            isOpen={storeModal.isOpen} onClose={storeModal.onClose} >
            
            <div className="">
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} 
                                                    placeholder="E-Commerce" 
                                                    {...field} />
                                            </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button disabled={loading} variant="outline" onClick={storeModal.onClose}>
                                    Cancel
                                </Button>
                                <Button disabled={loading}  type="submit">Continue</Button>
                            </div>
                        </form>
                    
                    </Form>
                </div>
            </div>        
        
        </Modal>
    );
}