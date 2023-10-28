"use client";



import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";

import { DataTable } from "@/components/ui/data-table";
import { OrderColumn, columns } from "./columns";



interface OrdersClientProps {
  data: OrderColumn[]
}


const OrdersClient: React.FC<OrdersClientProps> = ({ data }) => {

  
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Orders: (${data.length})`} description="Gerenciamento de pedidos para sua loja" />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  );
}

export default OrdersClient;