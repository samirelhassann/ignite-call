import { styled, Heading, Text } from "@saturn-design-system/react";

export const Container = styled("div", {
  maxWidth: "calc(100vw - (100vw - 1160px) / 2)",
  height: "100vh",
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  gap: "$20",

  "@media(max-width: 800px)": {
    width: "100vw",
    justifyContent: "center",
  },
});

export const Hero = styled("div", {
  maxWidth: 480,
  padding: "0 $10",

  "@media(max-width: 800px)": {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  [`> ${Heading}`]: {},

  [`> ${Text}`]: {
    marginTop: "$2",
    color: "$gray200",
  },
});

export const Preview = styled("div", {
  paddingRight: "$8",
  overflow: "hidden",

  "@media(max-width: 800px)": {
    display: "none",
  },
});
