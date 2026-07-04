 import { getBusinesses } from "@/app/actions/business"
 import { BusinessTable } from "@/components/dashboard/BusinessTable"
 import { NewBusinessDialog } from "@/components/dashboard/NewBusinessDialog"
 
 export const dynamic = "force-dynamic"
 
 export default async function BusinessesPage() {
   const businesses = await getBusinesses()
 
   return (
     <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
           <h1 className="text-2xl font-semibold tracking-tight">店铺管理</h1>
           <p className="text-sm text-muted-foreground mt-1">
             管理所有接入的店铺信息
           </p>
         </div>
         <NewBusinessDialog />
       </div>
 
       <BusinessTable businesses={businesses} />
     </div>
   )
 }
