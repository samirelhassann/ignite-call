import React from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/router";
import { ArrowRight } from "phosphor-react";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Text, TextInput } from "@saturn-design-system/react";

import { Form, FormAnnotation } from "./styles";

const claimUserNameFormSchema = z.object({
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters" })
    .regex(/^([a-z\\-]+)$/i, { message: "Username can only contain letters, numbers, or dashes" })
    .transform(username => username.toLowerCase())
});

type ClaimUsernameFormData = z.infer<typeof claimUserNameFormSchema>;

const ClaimUsernameForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUserNameFormSchema)
  });

  const router = useRouter();

  const handleClaimUsername = async (data: ClaimUsernameFormData) => {
    const { username } = data;

    await router.push(`/register?username=${username}`);
  };

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)} >
        <TextInput prefix="ignite.com/" placeholder="yor-user" {...register("username")} />

        <Button size="md" type="submit" disabled={isSubmitting}>
          Reserve
          <ArrowRight />
        </Button>

      </Form>

      <FormAnnotation>
        <Text size="sm">
          {errors.username && errors.username?.message}
        </Text>
      </FormAnnotation>
    </>
  );
};

export default ClaimUsernameForm;
