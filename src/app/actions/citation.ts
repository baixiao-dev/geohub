 "use server"
 
 import { prisma } from "@/lib/prisma"
 import { revalidatePath } from "next/cache"
 import { z } from "zod"
 
 const citationSchema = z.object({
   businessId: z.string().min(1),
   platform: z.string().min(1),
   queryKeyword: z.string().min(1),
   screenshotUrl: z.string().optional(),
 })
 
 export async function createCitation(formData: FormData) {
   try {
     const rawData = Object.fromEntries(formData)
     const validated = citationSchema.parse(rawData)
 
     const citation = await prisma.aiCitation.create({
       data: {
         businessId: validated.businessId,
         platform: validated.platform,
         queryKeyword: validated.queryKeyword,
         screenshotUrl: validated.screenshotUrl || "",
         citationDate: new Date(),
       },
     })
 
     revalidatePath("/dashboard/citations")
     return { success: true as const, citation }
   } catch (error) {
     console.error("Failed to create citation:", error)
     if (error instanceof z.ZodError) {
       const firstError = error.issues[0]
       return {
         success: false as const,
         message: "Validation failed: " + (firstError?.message || "Please check input"),
       }
     }
     return { success: false as const, message: "Failed to create citation" }
   }
 }
 
 export async function getCitations(businessId?: string) {
   try {
     return await prisma.aiCitation.findMany({
       where: businessId ? { businessId } : undefined,
       include: { business: true },
       orderBy: { createdAt: "desc" },
     })
   } catch (error) {
     console.error("Failed to get citations:", error)
     return []
   }
 }
 
 export async function deleteCitation(id: string) {
   try {
     await prisma.aiCitation.delete({ where: { id } })
     revalidatePath("/dashboard/citations")
     return { success: true as const }
   } catch (error) {
     console.error("Failed to delete citation:", error)
     return { success: false as const, message: "Failed to delete" }
   }
 }
 
 export async function updateCitationStatus(
   id: string,
   status: "pending" | "verified" | "published"
 ) {
   try {
     await prisma.aiCitation.update({ where: { id }, data: { status } })
     revalidatePath("/dashboard/citations")
     return { success: true as const }
   } catch (error) {
     console.error("Failed to update citation status:", error)
     return { success: false as const, message: "Failed to update" }
   }
 }
