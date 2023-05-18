/* eslint-disable import/named */
import { useForm } from "react-hook-form";

import { useRouter } from "next/router";

import dayjs from "dayjs";
import { CalendarBlank, Clock } from "phosphor-react";
import { z } from "zod";

import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Text, TextArea, TextInput } from "@saturn-design-system/react";

import {
  ButtonsArea,
  ConfirmForm,
  Container,
  FormError,
  FormItem,
  Header,
  HeaderIconText,
} from "./styles";

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome precisa ter no minimo 3 caracteres" }),
  email: z.string().email({ message: "Insira um e-mail válido" }),
  observations: z.string().nullable(),
});

type ConfirmFormData = z.infer<typeof confirmFormSchema>;

interface ConfirmStepProps {
  schedulingDate: Date;
  onCancelConfirmation: () => void;
}

export default function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  });

  const router = useRouter();
  const username = String(router.query.username);

  const handleConfirmScheduling = async (data: ConfirmFormData) => {
    const { name, email, observations } = data;

    await api.post(`/users/${username}/schedulle`, {
      name,
      email,
      observations,
      date: schedulingDate,
    });

    onCancelConfirmation();
  };

  const formatedFullDate = dayjs(schedulingDate).format(
    "DD[ de ]MMMM[ de ]YYYY"
  );

  const formatedHour = dayjs(schedulingDate).format("HH:mm[h]");

  return (
    <Container>
      <Header>
        <HeaderIconText>
          <CalendarBlank size={20} />
          <span>{formatedFullDate}</span>
        </HeaderIconText>

        <HeaderIconText>
          <Clock size={20} />
          <span>{formatedHour}</span>
        </HeaderIconText>
      </Header>

      <ConfirmForm onSubmit={handleSubmit(handleConfirmScheduling)}>
        <FormItem>
          <Text size="sm">Seu nome</Text>
          <TextInput {...register("name")} />
          {errors.name && (
            <FormError size="sm">{errors.name.message}</FormError>
          )}
        </FormItem>

        <FormItem>
          <Text size="sm">Endereço de e-mail</Text>
          <TextInput placeholder="Digite seu e-mail" {...register("email")} />
          {errors.email && (
            <FormError size="sm">{errors.email.message}</FormError>
          )}
        </FormItem>

        <FormItem>
          <Text size="sm">Obervações</Text>
          <TextArea {...register("observations")} />
          {errors.observations && (
            <FormError size="sm">{errors.observations.message}</FormError>
          )}
        </FormItem>

        <ButtonsArea>
          <Button variant="tertiary" onClick={onCancelConfirmation}>
            Cancelar
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            Confirmar
          </Button>
        </ButtonsArea>
      </ConfirmForm>
    </Container>
  );
}
