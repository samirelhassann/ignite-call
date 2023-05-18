import { useState } from "react";

import { CalendarStep } from "./CalendarStep";
import ConfirmStep from "./ConfirmStep";

export function ScheduleForm() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>();

  const handleClearSectedDateTime = () => {
    setSelectedDateTime(null);
  };

  if (selectedDateTime) {
    return (
      <ConfirmStep
        schedulingDate={selectedDateTime}
        onCancelConfirmation={handleClearSectedDateTime}
      />
    );
  }

  return <CalendarStep onSelectDateTime={setSelectedDateTime} />;
}
