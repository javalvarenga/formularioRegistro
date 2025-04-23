/* using api.ts create a services for particpants: changePaymmentStatus, ... */

import { api } from "../api";

export function changePaymmentStatus(participantId: number, newStatus: string) {
  return api.patch(`/participants/updatePaymentStatus/${participantId}`, {
    estadoPago: newStatus,
  });
}
