import { Prisma } from '@prisma/client';

export type Severity = 'error' | 'warning' | 'info' | 'success';

export interface StatusMessage {
  severity: Severity;
  message: string;
  timestamp: number;
}

export type ListWithNames = {
  name: string;
  user: string;
  id: number;
  nameId: number;
  avatar?: string;
};

export type UserWithPartners = Prisma.UserGetPayload<{
  include: {
    partnered: {
      include: {
        partnering: true;
        partnered: true;
      };
    };
    partnering: {
      include: {
        partnering: true;
        partnered: true;
      };
    };
  };
}>;

export type InProgressList = {
  name: string;
  position: number;
  id: number;
};

export type Duel = {
  left: ListWithNames;
  right: ListWithNames;
};
