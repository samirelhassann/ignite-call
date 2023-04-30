import React from "react";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ArrowRight, Check } from "phosphor-react";

import {
  Button,
  Heading,
  MultiStep,
  Text,
} from "@saturn-design-system/react";

import { Container, Header } from "../styles";
import { AuthError, ConnectBox, ConnectItem } from "./styles";

const CalendarConnect = () => {

  const { data: session } = useSession();
  const router = useRouter();

  const hasAuthError = !!router.query.error;
  const isSignedIn = !!session?.user && !hasAuthError;

  const handleSignIn = async () => {
    await signIn("google");
  };

  console.log("session", session);

  return (
    <Container>

      <Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>

      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>

          {isSignedIn ?
            <Button size="sm" disabled>
              Conectado
              <Check />
            </Button>
            :
            <Button variant="secondary" size="sm" onClick={handleSignIn}>Conectar
              <ArrowRight />
            </Button>
          }
        </ConnectItem>

        {hasAuthError && (
          <AuthError>
            Falha ao se conectar ao Google, verifique se voce habilitou as permissões de acesso ao Google Calendar.
          </AuthError>
        )}

        <Button type="submit" disabled={!isSignedIn}>
          Next Step
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  );
};

export default CalendarConnect;