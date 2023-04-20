import { Box, Button, Text, styled } from "@saturn-design-system/react";

export const Form = styled(Box, {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: "$2",
  marginTop: "$4",
  padding: "$4",

  "@media(max-width: 500px)": {
    width: "fit-content",
    display: "flex",
    gap: "$4",
    flexDirection: "column",
    alignItems: "center",

    [`> ${Button}`]: {
      width: "10rem",
    },
  },
});

export const FormAnnotation = styled("div", {
  marginTop: "$2",

  [`> ${Text}`]: {
    color: "$gray400",
  },
});
