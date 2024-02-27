import { Prisma } from '@prisma/client';

export interface Fruit {
  id: number;
  fruit: string;
  position: number;
  pivot?: boolean;
}

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
