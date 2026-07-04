"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

type FormItemContextValue = {
  id: string
 }
 
 const FormItemContext = React.createContext<FormItemContextValue>(
   {} as FormItemContextValue
 )
 
 const FormItem = React.forwardRef<
   HTMLDivElement,
   React.HTMLAttributes<HTMLDivElement>
 >(({ className, ...props }, ref) => {
   const id = React.useId()
 
   return (
     <FormItemContext.Provider value={{ id }}>
       <div
         ref={ref}
         className={cn("space-y-1.5", className)}
         {...props}
       />
     </FormItemContext.Provider>
   )
 })
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = { error: false, formItemId: undefined }

  return (
    <Label
      ref={ref}
      className={cn(error ? "text-destructive" : "", className)}
      htmlFor={formItemId}
      {...props}
    />
   )
 })
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {

  return (
    <div
      ref={ref}
      {...props}
    />
   )
 })
 FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {

  return (
    <p
      ref={ref}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
   )
 })
 FormDescription.displayName = "FormDescription"
 
 const FormMessage = React.forwardRef<
   HTMLParagraphElement,
   React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const body = children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
       {body}
     </p>
   )
 })
 FormMessage.displayName = "FormMessage"

export {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}
