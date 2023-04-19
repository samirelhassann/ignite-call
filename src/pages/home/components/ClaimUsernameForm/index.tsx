import React from "react";
import { useForm } from "react-hook-form";

import { ArrowRight } from "phosphor-react";
import { z } from "zod";

import { Button, TextInput } from "@saturn-design-system/react";

import { Form } from "./styles";


const claimUserNameFormSchema = z.object({
  username: z.string()
});

type ClaimUsernameFormData = z.infer<typeof claimUserNameFormSchema>;

const ClaimUsernameForm = () => {
  const { register, handleSubmit } = useForm<ClaimUsernameFormData>();

  const handleClaimUsername = async (data: any) => {
    console.log(data);
  };

  return (
    <Form as="form" onSubmit={handleSubmit(handleClaimUsername)} {...register("username")}>
      <TextInput prefix="ignite.com/" placeholder="yor-user" />

      <Button size="md" type="submit">
        Reserve
        <ArrowRight />
      </Button>
    </Form>
  );
};

export default ClaimUsernameForm;
