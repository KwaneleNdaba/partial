"use client";
import { currentUser } from "@clerk/nextjs";
import React, { ChangeEvent, useState } from "react";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { Textarea } from "../ui/textarea";;
import { CommentValidation, PartialValidation } from "@/lib/validations/partial";
import { addCommentToPartial, createPartial } from "@/lib/actions/partial.actions";
import Image from "next/image";


interface Props {
    partialId: string;
    currentUserImage: string;
    currentUserId: string;
}

function Comment({partialId, currentUserId,currentUserImage}:Props) {
  const pathname = usePathname();
  const router = useRouter();
  
  async function onSubmit(values: z.infer<typeof CommentValidation>) {
    await addCommentToPartial(partialId,values.partial,JSON.parse(currentUserId),pathname);
  
    form.reset()
  }
  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
     partial: ""
    },
  });

  return (
    <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="comment-form"
    >
      <FormField
        control={form.control}
        name="partial"
        render={({ field }) => (
          <FormItem className="flex items-center gap-3 w-full">
            <FormLabel >
              <Image src={currentUserImage} width ={48} height={48} className="rounded-full object-cover" alt ="profile-image" />
            </FormLabel>

            <FormControl className="border-none bg-transparent">
              <Input
                type="text"
                placeholder="comment..."
                className="no-focus text-light-1 outline-none"
                {...field}
              />
            </FormControl>
       
          </FormItem>
        )}
      />
      <Button className="comment-form_btn" type="submit">
        Reply
      </Button>
    </form>
  </Form>
  )
}

export default Comment
