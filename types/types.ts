import { Prisma } from '@prisma/client';

export type Severity = 'error' | 'warning' | 'info' | 'success';

export interface StatusMessage {
  severity: Severity;
  message: string;
}

export type ListWithNames = Prisma.ListGetPayload<{
  include: {
    name: true;
  };
}>;
