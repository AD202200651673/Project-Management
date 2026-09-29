import React, { use } from "react";
import { PriorityView } from "@/features/priority";

type Props = {
  params: Promise<{ priority: string }>;
};

export default function PriorityPage({ params }: Props) {
  const { priority } = use(params);
  return <PriorityView rawPriority={priority} />;
}
