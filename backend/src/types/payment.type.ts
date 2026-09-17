import { PaymentMethodStatus } from "../generated/prisma/enums";

export type PaymentMethodData = {
    name: string;
    status: PaymentMethodStatus
}