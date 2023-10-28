"use client";

import { useRouter, useParams } from "next/navigation";

import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import {SizeColumn, columns } from "./columns";



interface CategoryClientProps {
  data: SizeColumn[]
}


const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {

    const params = useParams();
    const router = useRouter();
  
    return (
      <>
        <div className="flex items-center justify-between">
          <Heading title={`Sizes: (${data.length})`} description="Gerenciamento de sizes para sua loja" />
          <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        <Separator />
        <DataTable columns={columns} data={data} searchKey="name" />
        <Heading title="API" description="Lista de chamada da Api para sizes" />
        <Separator />      
        <ApiList entityName="sizes" entityIdName="sizeId" /> 
      </>
    );
}

export default CategoryClient;