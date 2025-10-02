import Stripe from "stripe";

// Vérifie que la clé est définie dans l'environnement
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY manquant dans le fichier .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

export default stripe;
