import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ---- Auth: /api/auth/* ----
export const auth = {
  sendOtp: (email) => api.post("/auth/send-otp", { email }),
  verifyOtp: (email, otp) => api.post("/auth/verify-otp", { email, otp }),
  signup: (payload) => api.post("/auth/signup", payload), // { name, email, password, role } role: DONOR | NGO
  login: (payload) => api.post("/auth/login", payload), // { email, password }
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

// ---- Donors: /api/donors ----
export const donors = {
  // DONOR only. Body: { organizationName, phone, address, location? }
  createProfile: (payload) => api.post("/donors", payload),
  // ADMIN only
  list: () => api.get("/donors"),
  byId: (id) => api.get(`/donors/${id}`),
};

// ---- NGOs: /api/ngos ----
export const ngos = {
  // NGO only. Body: { ngoId, organizationName, phone, address, capacity, foodTypes, location? }
  createProfile: (payload) => api.post("/ngos", payload),
  // ADMIN, DONOR
  list: () => api.get("/ngos"),
  byId: (id) => api.get(`/ngos/${id}`),
};

// ---- Donations: /api/donations ----
export const donations = {
  // DONOR only. Body: { donationId, foodName, category, quantity, unit, location, expiryTime }
  create: (payload) => api.post("/donations", payload),
  // NGO, ADMIN only — there is no donor-scoped "my donations" endpoint yet
  list: () => api.get("/donations"),
  updateStatus: (donationId, status) =>
    api.patch(`/donations/${donationId}/status`, { status }),
};

// ---- Claims: /api/claims ----
export const claims = {
  // NGO only. Body: { claimId, donationId } — donationId is the Mongo _id
  create: (payload) => api.post("/claims", payload),
  // NGO, ADMIN
  list: () => api.get("/claims"),
};

// ---- Admin: /api/admin/* + DA sync ----
export const admin = {
  dashboard: () => api.get("/admin/dashboard"),
  syncDAOutput: () => api.post("/sync-da-output"),
};

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent("auth:expired"));
    }
    return Promise.reject(error);
  }
);

// ---- Local, device-only donation history ----
// The backend does not yet expose a donor-scoped "my donations" endpoint
// (GET /api/donations is restricted to NGO/ADMIN). Until that ships, a
// donor's own submissions are cached on this device so they can see what
// they've logged. This is clearly local, not a shared source of truth.
const MY_DONATIONS_KEY = "foodlink:my-donations";

export const myDonationsCache = {
  all() {
    try {
      return JSON.parse(localStorage.getItem(MY_DONATIONS_KEY) || "[]");
    } catch {
      return [];
    }
  },
  add(donation) {
    const list = this.all();
    list.unshift(donation);
    localStorage.setItem(MY_DONATIONS_KEY, JSON.stringify(list.slice(0, 100)));
  },
};

export default api;
