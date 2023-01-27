import paypal from "@paypal/checkout-server-sdk";
// Creating an environment
let clientId =
  "AQbFrwKaxNfBe-RHxl8Au8M1dcCYKG0mY4KvO5bMQ1MDXP43zPMYFkV6XxDj0ybld2YYCGJHAuWh7x9w";
let clientSecret =
  "EAcgeEPgZaSyj_GE06h8gBzBqVcMkwA7uyR39D834ZWspspS5KDyY-_WAwsoC6caNkm49O4RYmaLJsxe";

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const request = new paypal.orders.OrdersCreateRequest();
    request
      .requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: "100.00",
            },
          },
        ],
      })
      .headers({
        Authorization:
          "Bearer A21AALlTz21trxisTinTiZy294TWyG4EpkJfFP-TzufEfrXvr--gKXsfiwlq2HeG-_lfOeU8khGsmtW-iA3ohg_EzjwTxx_MQ",
      });
    const response = await client.execute(request);

    return res.json({ id: response.result.id });
  }
}
