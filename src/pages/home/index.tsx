
import React from "react";

import Image from "next/image";

import { Heading, Text } from "@saturn-design-system/react";

import previewImage from "../../assets/app-preview.png";
import { Container, Hero, Preview } from "./styles";

const Home = () => {
  return <Container>
    <Hero>
      <Heading as="h1" size="4xl" >Agendameto Descomplicado</Heading>
      <Text size="xl">
                Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.
      </Text>
    </Hero>
    <Preview>
      <Image src={previewImage} alt="Calendar showing the running application" quality={100} priority />
    </Preview>
  </Container>;
};

export default Home;
