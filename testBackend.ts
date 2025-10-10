import axios from "axios";
type AxiosResponse<T = any> = import("axios").AxiosResponse<T>;

const API_URL = "http://localhost:4000/api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}

interface AuthResponse {
  user: UserData;
  token: string;
}

interface ProductData {
  id: number;
  name: string;
  priceCents: number;
}

interface ReservationData {
  id: number;
  service: string;
  amountCents: number;
}

async function main() {
  try {
    let token = "";
    let userId = 0;

    // 🧩 1️⃣ Inscription
    try {
      const registerResp: AxiosResponse<ApiResponse<AuthResponse>> =
        await axios.post(`${API_URL}/auth/register`, {
          name: "Test User",
          email: "testuser@example.com",
          password: "Password123!",
          role: "USER",
        });
      console.log(`✅ Inscription OK: ${registerResp.data.data.user.email}`);
      token = registerResp.data.data.token;
      userId = registerResp.data.data.user.id;
    } catch {
      console.warn("⚠️ Inscription échouée (peut-être déjà créée)");
    }

    // 🧩 2️⃣ Connexion
    const loginResp: AxiosResponse<ApiResponse<AuthResponse>> =
      await axios.post(`${API_URL}/auth/login`, {
        email: "testuser@example.com",
        password: "Password123!",
      });
    token = loginResp.data.data.token;
    userId = loginResp.data.data.user.id;
    console.log(`✅ Connexion OK, token: ${token}`);

    // 🧩 3️⃣ Création produit
    const createResp: AxiosResponse<ApiResponse<ProductData>> =
      await axios.post(
        `${API_URL}/products`,
        {
          name: "Perceuse Electrique",
          description: "Pour travaux intensifs",
          priceCents: 12000,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

    console.log(`✅ Produit créé: ${createResp.data.data.name}`);
    const productId = createResp.data.data.id;

    // 🧩 4️⃣ Récupération produit
    const getResp: AxiosResponse<ApiResponse<ProductData>> = await axios.get(
      `${API_URL}/products/${productId}`
    );
    console.log(`✅ Produit récupéré: ${getResp.data.data.name}`);

    // 🧩 5️⃣ Réservation (test fonctionnel)
    const reservationResp: AxiosResponse<ApiResponse<ReservationData>> =
      await axios.post(
        `${API_URL}/reservations`,
        {
          userId,
          nomClient: "Test Client",
          emailClient: "client@example.com",
          service: "Nettoyage",
          surface: 50,
          distanceKm: 10,
          amountCents: 15000,
          products: [{ id: productId }],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

    console.log(`✅ Réservation OK: ID ${reservationResp.data.data.id}`);
  } catch (err: any) {
    console.error(
      "❌ Erreur dans les tests:",
      err.response?.data || err.message
    );
  }
}

main();
