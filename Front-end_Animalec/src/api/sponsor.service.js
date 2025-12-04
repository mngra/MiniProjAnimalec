import API_URL from "./config.js";

const createFormData = payload => {
  const formData = new FormData();
  if (payload.logo) {
    formData.append("logo", payload.logo, payload.logo.name);
  }

  for (const key in payload) {
    if (payload.hasOwnProperty(key) && key !== "logo") {
      const value = payload[key];

      if (Array.isArray(value) || typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      }
      else if (key !== "_id" && key !== "__v") {
        formData.append(key, value);
      }
    }
  }
  return formData;
};

export const sponsorService = {
  async getSponsors(token) {
    let response = await fetch(`${API_URL}/sponsors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw Error(handleResponses(response.status));
    }
  },
  async addSponsor(token, payload) {
    const formData = createFormData(payload);

    const response = await fetch(`${API_URL}/sponsors`, {
      method: "POST",
      headers: {
        Authorization: token
      },
      body: formData 
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw Error(handleResponses(response.status));
    }
  },
  async editSponsor(token, payload) {
    const formData = createFormData(payload);
    const id = payload._id;
    const response = await fetch(`${API_URL}/sponsors/${id}`, {
      method: "PUT",
      headers: {
        Authorization: token
      },
      body: formData
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw Error(handleResponses(response.status));
    }
  },
  async removeSponsor(token, id) {
    const response = await fetch(`${API_URL}/sponsors/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw Error(handleResponses(response.status));
    }
  }
};
function handleResponses(code) {
  let message = "";
  switch (code) {
    case 401:
      message = "Não está autorizado a executar esta ação!";
      break;
    default:
      message = "Mensagem desconhecida";
      break;
  }
  return message;
}
export default sponsorService;
