const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");
const REQUEST_TIMEOUT_MS = 15000;

const request = async (path, { method = "GET", token, body, isFormData = false } = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
      signal: controller.signal,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }
    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  getCurrentUser: (token) => request("/auth/me", { token }),
  updateCharitySelection: (token, payload) =>
    request("/auth/me/charity", { method: "PATCH", token, body: payload }),
  getMySubscription: (token) => request("/subscriptions/me", { token }),
  upsertSubscription: (token, payload) =>
    request("/subscriptions/me", { method: "POST", token, body: payload }),
  cancelMySubscription: (token) =>
    request("/subscriptions/me/cancel", { method: "PATCH", token }),
  getMyScores: (token) => request("/scores/me", { token }),
  addScore: (token, payload) =>
    request("/scores/me", { method: "POST", token, body: payload }),
  getCharities: () => request("/charities"),
  getLatestDraw: (token) => request("/draws/latest", { token }),
  getMyWinnerClaims: (token) => request("/draws/my-claims", { token }),
  uploadWinnerProof: (token, drawId, winnerId, file) => {
    const formData = new FormData();
    formData.append("proofImage", file);
    return request(`/draws/${drawId}/winners/${winnerId}/proof`, {
      method: "POST",
      token,
      body: formData,
      isFormData: true,
    });
  },
  adminListUsers: (token) => request("/admin/users", { token }),
  adminUpdateUser: (token, userId, payload) =>
    request(`/admin/users/${userId}`, { method: "PATCH", token, body: payload }),
  adminListSubscriptions: (token) => request("/admin/subscriptions", { token }),
  adminUpdateSubscription: (token, subscriptionId, payload) =>
    request(`/admin/subscriptions/${subscriptionId}`, {
      method: "PATCH",
      token,
      body: payload,
    }),
  adminListCharities: (token) => request("/admin/charities", { token }),
  adminCreateCharity: (token, payload) =>
    request("/charities", { method: "POST", token, body: payload }),
  adminUpdateCharity: (token, charityId, payload) =>
    request(`/charities/${charityId}`, { method: "PATCH", token, body: payload }),
  adminListWinnerClaims: (token) => request("/admin/draws/winner-claims", { token }),
  adminVerifyWinner: (token, drawId, winnerId, verificationStatus) =>
    request(`/admin/draws/${drawId}/winners/${winnerId}/verify`, {
      method: "PATCH",
      token,
      body: { verificationStatus },
    }),
  adminMarkWinnerPaid: (token, drawId, winnerId) =>
    request(`/admin/draws/${drawId}/winners/${winnerId}/pay`, {
      method: "PATCH",
      token,
    }),
  adminSimulateDraw: (token, payload) =>
    request("/draws/simulate", { method: "POST", token, body: payload }),
  adminPublishDraw: (token, payload) =>
    request("/draws/publish", { method: "POST", token, body: payload }),
};

export const getAssetUrl = (assetPath) => {
  if (!assetPath) return "";
  if (assetPath.startsWith("http")) return assetPath;
  return `${API_ORIGIN}${assetPath}`;
};
