import { PromiseParams } from "@/lib/types";
import OrderDetailPageClient from "./page.client";



export default async function OrderDetailPage({ params }: PromiseParams<{id: string}>) {
  const {id} = await params;

  
  return <OrderDetailPageClient id={id}/>
}

