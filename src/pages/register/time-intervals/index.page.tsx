import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { ArrowRight } from "phosphor-react";
import { z } from "zod";

import getWeekDays from "@/utils/getWeekDays";
import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from "@saturn-design-system/react";

import { Container, Header } from "../styles";
import { IntervalBox, IntervalDay, IntervalInputs, IntervalItem, IntervalsContainer } from "./styles";

const timeIntervalsFormSchema = z.object({

});

const TimeIntervals = () => {

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      intervals: [
        { weekday: 0, enabled: false, startTime: "08:00", endTime: "18:00" },
        { weekday: 1, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekday: 2, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekday: 3, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekday: 4, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekday: 5, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekday: 6, enabled: false, startTime: "08:00", endTime: "18:00" },
      ]
    }
  });

  const intervals = watch("intervals");

  const weekDays = getWeekDays();

  const { fields } = useFieldArray({
    control,
    name: "intervals",
  });

  const handleSetTimeIntervals = async (data: any) => {
    console.log(data);
  };

  return (
    <Container>
      <Header>
        <Heading as="strong">Quase lá</Heading>
        <Text>
          Defina o intervalo de horários que você está disponível em cada dia da semana.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>

      <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
        <IntervalsContainer>
          {fields.map((field, index) => {
            return <IntervalItem key={field.id}>
              <IntervalDay>

                <Controller name={`intervals.${index}.enabled`} control={control} render={({ field }) => {
                  return (
                    <Checkbox
                      onCheckedChange={checked => field.onChange(checked === true)}
                      checked={field.value}
                    />
                  );
                }}
                />

                <Text>{weekDays[field.weekday]}</Text>
              </IntervalDay>

              <IntervalInputs>
                <TextInput 
                  type="time"
                  step={60}
                  disabled={!intervals[index].enabled}
                  {...register(`intervals.${index}.startTime`)}
                />
                <TextInput type="time" step={60} {...register(`intervals.${index}.endTime`)} disabled={!intervals[index].enabled} />
              </IntervalInputs>
            </IntervalItem>;
          })}

        </IntervalsContainer>

        <Button type="submit">
          Próximo Passo
          <ArrowRight />
        </Button>

      </IntervalBox>
    </Container>
  );
};

export default TimeIntervals;
