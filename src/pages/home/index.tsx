import React from "react";

import { NextSeo } from "next-seo";
import Image from "next/image";

import { Heading, Text } from "@saturn-design-system/react";

import ClaimUsernameForm from "./components/ClaimUsernameForm";

import previewImage from "../../assets/app-preview.png";
import { Container, Hero, Preview } from "./styles";

function Home() {
  return (
    <>
      <NextSeo
        title="Descomplique sua agenda | Ignite Call"
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
      />

      <Container>
        <Hero>
          <Heading as="h1" size="4xl">
            Agendameto Descomplicado
          </Heading>
          <Text size="xl">
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo livre.
          </Text>

          <ClaimUsernameForm />
        </Hero>
        <Preview>
          <Image
            src={previewImage}
            alt="Calendar showing the running application"
            quality={100}
            priority
          />
        </Preview>
      </Container>
    </>
  );
}

export default Home;
