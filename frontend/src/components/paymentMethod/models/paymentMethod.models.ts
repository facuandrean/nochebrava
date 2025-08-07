export interface PaymentMethod {
  payment_method_id: string;
  name: string;
}

export interface ParsedPaymentMethod {
  id: string;
  payment_method_id: string;
  name: string;
}

export interface PaymentMethodRequest {
  name: string;
}

export interface PaymentMethodResponse {
  data: PaymentMethod[];
  status: string;
  message: string;
}