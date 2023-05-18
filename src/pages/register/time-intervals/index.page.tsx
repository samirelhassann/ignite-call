import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

import { ArrowRight } from "phosphor-react";
import { z } from "zod";

import { api } from "@/lib/axios";
import converStringTimeToMinutes from "@/utils/convertStringTimeToMinutes";
import getWeekDays from "@/utils/getWeekDays";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from "@saturn-design-system/react";

import { Container, Header } from "../styles";
import {
  FormError,
  IntervalBox,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
  IntervalsContainer,
} from "./styles";

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: "Please select at least one time interval.",
    })
    .transform((intervals) =>
      intervals.map((interval) => ({
        weekDay: interval.weekDay,
        startTimeInMinutes: converStringTimeToMinutes(interval.startTime),
        endTimeInMinutes: converStringTimeToMinutes(interval.endTime),
      }))
    )
    .refine(
      (intervals) =>
        intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 > interval.startTimeInMinutes
        ),
      {
        message: "End time must be at least 60 minutes after start time.",
      }
    ),
});

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>;
// eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
type TimeIntervalsFormOutput = z.infer<typeof timeIntervalsFormSchema>;

function TimeIntervals() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        {
          weekDay: 0,
          enabled: false,
          startTime: "08:00",
          endTime: "18:00",
        },
        {
          weekDay: 1,
          enabled: true,
          startTime: "08:00",
          endTime: "18:00",
        },
        {
          weekDay: 2,
          enabled: true,
          startTime: "08:00",
          endTime: "18:00",
        },
        {
          weekDay: 3,
          enabled: true,
          startTime: "08:00",
          endTime: "18:00",
        },
        {
          weekDay: 4,
          enabled: true,
          startTime: "08:00",
          endTime: "18:00",
        },
        {
          weekDay: 5,
          enabled: true,
          startTime: "08:00",
          endTime: "18:00",
        },
        {
          weekDay: 6,
          enabled: false,
          startTime: "08:00",
          endTime: "18:00",
        },
      ],
    },
  });

  const router = useRouter();

  const intervals = watch("intervals");

  const weekDays = getWeekDays();

  const { fields } = useFieldArray({
    control,
    name: "intervals",
  });

  const handleSetTimeIntervals = async (data: TimeIntervalsFormInput) => {
    await api.post("users/time-intervals", data);

    await router.push("/register/update-profile");
  };

  return (
    <>
      <NextSeo title="Selecione sua disponibilidade | Ignite Call" noindex />

      <Container>
        <Header>
          <Heading as="strong">Quase lá</Heading>
          <Text>
            Defina o intervalo de horários que você está disponível em cada dia
            da semana.
          </Text>

          <MultiStep size={4} currentStep={2} />
        </Header>

        <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
          <IntervalsContainer>
            {fields.map((field, index) => (
              <IntervalItem key={field.id}>
                <IntervalDay>
                  <Controller
                    name={`intervals.${index}.enabled`}
                    control={control}
                    render={({ field: fieldController }) => (
                      <Checkbox
                        onCheckedChange={(checked) =>
                          fieldController.onChange(checked === true)
                        }
                        checked={fieldController.value}
                      />
                    )}
                  />

                  <Text>{weekDays[field.weekDay]}</Text>
                </IntervalDay>

                <IntervalInputs>
                  <TextInput
                    type="time"
                    step={60}
                    disabled={!intervals[index].enabled}
                    {...register(`intervals.${index}.startTime`)}
                  />
                  <TextInput
                    type="time"
                    step={60}
                    {...register(`intervals.${index}.endTime`)}
                    disabled={!intervals[index].enabled}
                  />
                </IntervalInputs>
              </IntervalItem>
            ))}
          </IntervalsContainer>

          {errors.intervals && (
            <FormError>{errors.intervals.message}</FormError>
          )}

          <Button type="submit" disabled={isSubmitting}>
            Próximo Passo
            <ArrowRight />
          </Button>
        </IntervalBox>
      </Container>
    </>
  );
}

export default TimeIntervals;
