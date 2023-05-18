import { Box, Text, styled } from "@saturn-design-system/react";

export const Container = styled(Box, {
  margin: "$6 auto 0",
  display: "grid",
  maxWidth: "100%",
  position: "relative",
  gap: "$4",

  variants: {
    isTimePickerOpen: {
      true: {
        gridTemplateColumns: "1fr 280px",

        "@media(max-width: 900px)": {
          gridTemplateColumns: "1fr",
        },
      },
      false: {
        width: 540,
        gridTemplateColumns: "1fr",
      },
    },
  },
});

export const TimePicker = styled("div", {
  paddingLeft: "$6",
  display: "flex",
  flexDirection: "column",
  gap: "$3",
  borderLeft: "2px solid $colors$gray600",

  "@media (max-width: 900px)": {
    borderLeft: "none",
    borderTop: "2px solid $colors$gray600",
    paddingTop: "$4",
  },
});

export const TimePickerHeader = styled(Text, {
  fontWeight: "$medium",
  textTransform: "capitalize",

  "> span": {
    color: "$gray200",
    textTransform: "lowercase",
  },

  "@media (max-width: 900px)": {
    alignSelf: "center",
  },
});

export const TimePickerList = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "$2",
  maxHeight: "27.375rem",
  overflowY: "scroll",
  scroll: "hidden",
  padding: "$1",

  "@media (max-width: 900px)": {
    gridTemplateColumns: "repeat(2, 1fr)",
  },

  "&::-webkit-scrollbar": {
    width: ".375rem",
  },

  "&::-webkit-scrollbar-thumb": {
    background: "$gray500",
    borderRadius: "24px",
    borderRight: "none",
    borderLeft: "none",
  },
});

export const TimePickerItem = styled("button", {
  all: "unset",

  width: "100%",
  padding: "$2 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "$gray600",
  color: "$white",
  borderRadius: "$sm",
  fontSize: "$sm",
  fontFamily: "$default",
  lineHeight: "$base",
  cursor: "pointer",

  "&:disabled": {
    background: "none",
    cursor: "default",
    opacity: 0.4,
  },

  "&:not(:disabled):hover": {
    background: "$gray500",
  },

  "&:focus": {
    boxShadow: "0 0 0 2px $colors$gray100",
  },
});
