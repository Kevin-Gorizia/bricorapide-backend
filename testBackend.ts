import axios, { type AxiosResponse } from "axios"; // ✅ correct

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
    // 1️⃣ Inscription
    let token = "";
    let userId = 0;
    try {
      const registerResp: AxiosResponse<ApiResponse<AuthResponse>> = await axios.post(
        `${API_URL}/auth/register`,
        {
          name: "Test User",
          email: "testuser@example.com",
          password: "Password123!",
          role: "USER",
        }
      );

      console.log(`✅ Inscription OK: ${registerResp.data.data.user.email}`);
      token = registerResp.data.data.token;
      userId = registerResp.data.data.user.id;
    } catch (err: any) {
      console.warn("⚠️ Inscription échouée (peut-être déjà créé)");
    }

    // 2️⃣ Connexion
    const loginResp: AxiosResponse<ApiResponse<AuthResponse>> = await axios.post(
      `${API_URL}/auth/login`,
      {
        email: "testuser@example.com",
        password: "Password123!",
      }
    );
    token = loginResp.data.data.token;
    userId = loginResp.data.data.user.id;
    console.log(`✅ Connexion OK, token: ${token}`);

    // 3️⃣ Création produit
    const createResp: AxiosResponse<ApiResponse<ProductData>> = await axios.post(
      `${API_URL}/products`,
      {
        name: "Perceuse Electrique",
        description: "Pour travaux intensifs",
        priceCents: 12000,
      },
      { headers: { Authorization: `Bearer ${token}`
