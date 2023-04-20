import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/router";
import { ArrowRight } from "phosphor-react";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Heading, MultiStep, Text, TextInput } from "@saturn-design-system/react";

import { Container, Form, FormError, Header } from "./styles";

const registerFormSchema = z.object({
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters" })
    .regex(/^([a-z\\-]+)$/i, { message: "Username can only contain letters, numbers, or dashes" })
    .transform(username => username.toLowerCase()),
  completeName: z.string().min(3, { message: "Complete name must be at least 3 characters" }),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

const Register = () => {

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
      resolver: zodResolver(registerFormSchema)
    });

  const router = useRouter();

  useEffect(() => {
    if (router.query.username) {
      setValue("username", String(router.query?.username));
    }

  }, [router.query?.username]);

  const handleRegister = async (data: RegisterFormData) => {
    console.log(data);
  };

  return <Container>
    <Header>
      <Heading as="strong">
        Bem-vindo ao Ignite Call!
      </Heading>
      <Text>
        Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essainformações depois.
      </Text>

      <MultiStep size={4} currentStep={1} />
    </Header>

    <Form as="form" onSubmit={handleSubmit(handleRegister)}>
      <label>
        <Text size="sm">User name</Text>
        <TextInput prefix="ignite.com/" alt="user-name" {...register("username")} />

        {errors.username && (
          <FormError size="sm">
            {errors.username.message}
          </FormError>
        )}
      </label>

      <label>
        <Text size="sm">Complete name</Text>
        <TextInput placeholder="inform your name" alt="complete-name" {...register("completeName")} />
        {errors.completeName && (
          <FormError size="sm">
            {errors.completeName.message}
          </FormError>
        )}
      </label>

      <Button type="submit" disabled={isSubmitting}>
        Next Step
        <ArrowRight />
      </Button>

    </Form>
  </Container>;
};

export default Register;
