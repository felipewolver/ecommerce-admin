"use client";

import { useRouter, useParams } from "next/navigation";

import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { BillboardColumn, columns } from "./columns";



interface BillboardClientProps {
  data: BillboardColumn[]
}


const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {

    const params = useParams();
    const router = useRouter();
  
    return (
      <>
        <div className="flex items-center justify-between">
          <Heading title={`Billboards: (${data.length})`} description="Gerenciamento de billboards para sua loja" />
          <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        <Separator />
        <DataTable columns={columns} data={data} searchKey="label" />
        <Heading title="API" description="Lista de chamada da Api para os billboards" />
        <Separator />      
        <ApiList entityName="billboards" entityIdName="billboardId" /> 
      </>
    );
}

export default BillboardClient;