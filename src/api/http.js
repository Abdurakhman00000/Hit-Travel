export function getTokenHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Token ${token}` } : {};
}

export function getBearerHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getApiErrorMessage(error) {
  const data = error?.response?.data;

  if (typeof data === "string") return data;
  if (typeof data?.error === "string") return data.error;
  if (typeof data?.message === "string") return data.message;
  if (typeof data?.detail === "string") return data.detail;

  if (data && typeof data === "object") {
    const messages = [];

    const collect = (value, prefix = "") => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (typeof item === "string") {
            messages.push(prefix ? `${prefix}: ${item}` : item);
          } else if (item && typeof item === "object") {
            Object.entries(item).forEach(([key, nested]) =>
              collect(nested, prefix ? `${prefix}.${key}` : key)
            );
          }
        });
        return;
      }

      if (value && typeof value === "object") {
        Object.entries(value).forEach(([key, nested]) =>
          collect(nested, prefix ? `${prefix}.${key}` : key)
        );
      }
    };

    collect(data);
    if (messages.length) return messages.join("; ");
  }

  return error?.message || "Произошла ошибка при обращении к серверу";
}

export function getRedirectUrl(path = "/") {
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}#${path}`;
}
