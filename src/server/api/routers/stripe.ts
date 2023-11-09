import { env } from "~/env.mjs";
import { getOrCreateStripeCustomerIdForUser } from "~/server/stripe/stripe-webhook-handlers";
import { createTRPCRouter, publicProcedure} from "~/server/api/trpc";

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: publicProcedure.mutation(async ({ ctx }) => {
    const { stripe, auth, db, req } = ctx;

    const customerId = await getOrCreateStripeCustomerIdForUser({
      prisma: db,
      stripe,
      userId: db.user?.id,
    });

    if (!customerId) {
      throw new Error("Could not create customer");
    }

    const baseUrl =
      env.NODE_ENV === "development"
        ? `http://${req.headers.host ?? "localhost:3000"}`
        : `https://${req.headers.host ?? env.NEXTAUTH_URL}`;

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: db.user?.id,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?checkoutSuccess=true`,
      cancel_url: `${baseUrl}/dashboard?checkoutCanceled=true`,
      subscription_data: {
        metadata: {
          userId: db.user?.id,
        },
      },
    });

    if (!checkoutSession) {
      throw new Error("Could not create checkout session");
    }

    return { checkoutUrl: checkoutSession.url };
  }),
  createBillingPortalSession: publicProcedure.mutation(async ({ ctx }) => {
    const { stripe, auth, db, req } = ctx;

    const customerId = await getOrCreateStripeCustomerIdForUser({
      prisma: db,
      stripe,
      userId: db.user?.id,
    });

    if (!customerId) {
      throw new Error("Could not create customer");
    }

    const baseUrl =
      env.NODE_ENV === "development"
        ? `http://${req.headers.host ?? "localhost:3000"}`
        : `https://${req.headers.host ?? env.NEXTAUTH_URL}`;

    const stripeBillingPortalSession =
      await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${baseUrl}/dashboard`,
      });

    if (!stripeBillingPortalSession) {
      throw new Error("Could not create billing portal session");
    }

    return { billingPortalUrl: stripeBillingPortalSession.url };
  }),
});