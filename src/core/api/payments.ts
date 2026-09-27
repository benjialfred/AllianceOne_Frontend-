import { apiClient as api } from './client';

export interface CheckoutInitiateResponse {
  checkout_url: string;
  reference: string;
  transaction_code?: string;
}

export class PaymentsApi {
  /**
   * Initiates a Nelsius checkout session and returns the checkout URL.
   */
  static async initiateCheckout(
    amount: number,
    description: string,
    returnUrl: string,
    cancelUrl: string
  ): Promise<CheckoutInitiateResponse> {
    const response = await api.post<CheckoutInitiateResponse>('/payments/checkout/initiate/', {
      amount,
      currency: 'XAF', // Default
      description,
      return_url: returnUrl,
      cancel_url: cancelUrl
    });
    return response.data;
  }
}
