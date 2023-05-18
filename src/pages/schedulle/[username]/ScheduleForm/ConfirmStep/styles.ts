import { Box, Button, Text, styled } from "@saturn-design-system/react";

export const Container = styled(Box, {
  maxWidth: 574,
  margin: "$6 auto 0",
  display: "flex",
  flexDirection: "column",
  gap: "$4",
});

export const Header = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$4",
  paddingBottom: "$6",
  borderBottom: "1px solid $gray600",
});

export const HeaderIconText = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$2",
  fontFamily: "$default",

  "> svg": {
    color: "$gray200",
  },

  "> span": {
    fontWeight: "$regular",
    lineHeight: "$base",
  },
});

export const ConfirmForm = styled("form", {
  display: "flex",
  flexDirection: "column",
  gap: "$4",
});

export const FormItem = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$2",
});

export const ButtonsArea = styled("div", {
  marginTop: "$2",
  display: "flex",
  justifyContent: "end",
  gap: "$4",

  [`> ${Button}`]: {
    width: "7.0625rem",
  },
});

export const FormError = styled(Text, {
  color: "#F75A68",
});
