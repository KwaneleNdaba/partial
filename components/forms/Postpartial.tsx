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
import { Textarea } from "../ui/textarea";
import { updateUser } from "@/lib/actions/user.actions";
import { PartialValidation } from "@/lib/validations/partial";
import { createPartial } from "@/lib/actions/partial.actions";
import { Router } from "lucide-react";

function Postpartial({ userId }: { userId: string }) {
  interface Props {
    user: {
      id: string;
      objectId: string;
      username: string;
      name: string;
      bio: string;
      image: string;
    };
    btnTitle: string;
  }

  const pathname = usePathname();

  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(PartialValidation),
    defaultValues: {
      partial: "",
      accountId: userId,
    },
  });

  async function onSubmit(values: z.infer<typeof PartialValidation>) {
    await createPartial({
      text: values.partial,
      author: userId,
      communityId: null,
      path: pathname,
    });
    router.push("/");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10 mt-10"
      >
        <FormField
          control={form.control}
          name="partial"
          render={({ field }) => (
            <FormItem className="flex flex-col  gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-1">
                Content
              </FormLabel>

              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea
                  rows={15}
                  placeholder="type your Partial"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="bg-primary-500" type="submit">
          Post Partial
        </Button>
      </form>
    </Form>
  );
}

export default Postpartial;
