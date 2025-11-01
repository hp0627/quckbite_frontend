export const BASEURL = "http://localhost:8082/"; // Or your server URL

export const callApi = async (method, url, data, callback) => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      ...(method !== 'GET' && data ? { body: data } : {})
    });

    const text = await response.text();

    if (!response.ok) {
      callback(`500::${text || "Server error"}`);
    } else {
      callback(text);
    }
  } catch (error) {
    console.error("API call failed:", error);
    callback("500::Network error");
  }
};

export const setSession = (key, value, days) => {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${key}=${value}; expires=${expires}; path=/`;
};
