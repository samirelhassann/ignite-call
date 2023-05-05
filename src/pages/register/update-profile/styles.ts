import { Box, Text, styled } from "@saturn-design-system/react";

export const ProfileBox = styled(Box, {
  marginTop: "$6",
  display: "flex",
  flexDirection: "column",
  gap: "$4",

  label: {
    display: "flex",
    flexDirection: "column",
    gap: "$2",
  },
});

export const FormAnnotation = styled(Text, {
  color: "$gray200",
  alignSelf: "center",
});
