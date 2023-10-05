"use client";
import * as z from "zod";
import { addCommentToThread, createThread } from "@/lib/actions/thread.actions";
import { CommentValidation, ThreadValidation } from "@/lib/validations/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Image from "next/image";
import { useState } from "react";
import usePreventMultipleSubmit from "../ui/preventMultipleSubmit";
import { ThreeDots } from "react-loader-spinner";

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const preventMultipleSubmit = usePreventMultipleSubmit(); // Use the custom hook
  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onInvalid = (errors: any) => console.error(errors);

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    await preventMultipleSubmit(async () => {
      console.log();
      try {
        await addCommentToThread({
          threadId: threadId,
          commentText: values.thread,
          userId: JSON.parse(currentUserId),
          path: pathname,
        });
      } catch (error: any) {
        throw new Error("error here ", error.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="comment-form"
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="Profile Image"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className={`comment-form_btn`}>
          replay
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
