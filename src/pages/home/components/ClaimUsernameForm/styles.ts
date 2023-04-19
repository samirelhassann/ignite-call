import { Box, Button, styled } from "@saturn-design-system/react";

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
