import sponsorService from "@/api/sponsor.service";
import {
  // Actions
  FETCH_SPONSORS,
  ADD_SPONSOR,
  EDIT_SPONSOR,
  REMOVE_SPONSOR,
  // Mutations
  SET_SPONSORS,
  SET_MESSAGE
} from "./sponsor.constants";

const state = {
  sponsors: []
};

const getters = {
  getSponsors: state => state.sponsors,
  getSponsorsById: state => id =>
    state.sponsors.find(sponsor => sponsor._id === id),
  getMessage: state => state.message
};

const actions = {
  [FETCH_SPONSORS]: ({ commit, rootState }) => {
    return new Promise((resolve, reject) => {
      sponsorService.getSponsors(rootState.auth.token).then(
        res => {
          const modifiedSponsors = res.body.map(sponsor => {
            // Verifica se o patrocinador tem um campo 'startDate'
            if (sponsor.startDate) {
              // Modifica o campo 'startDate'
              sponsor.startDate = sponsor.startDate.split("T")[0];
            }
            if (sponsor.endDate) {
              // Modifica o campo 'endDate'
              sponsor.endDate = sponsor.endDate.split("T")[0];
            }
            return sponsor;
          });
          commit(SET_SPONSORS, modifiedSponsors);
          resolve(res);
        },
        err => {
          commit(SET_MESSAGE, err.message);
          reject(err);
        }
      );
    });
  },
  [ADD_SPONSOR]: ({ commit, rootState }, payload) => {
    return new Promise((resolve, reject) => {
      sponsorService.addSponsor(rootState.auth.token, payload).then(
        res => {
          commit(
            SET_MESSAGE,
            `O patrocinador ${res.body.name} foi adicionado com sucesso!`
          );
          resolve(res);
        },
        err => {
          commit(SET_MESSAGE, err.message);
          reject(err);
        }
      );
    });
  },
  [EDIT_SPONSOR]: ({ commit, rootState }, payload) => {
    // O payload é o objeto patrocinador com o nome correto (ex: payload.name)
    const sponsorName = payload.name;

    return new Promise((resolve, reject) => {
      sponsorService.editSponsor(rootState.auth.token, payload).then(
        () => {
          // CORRIGIDO: Usar o nome do objeto que enviamos (payload)
          const successMessage = `O patrocinador ${sponsorName} foi atualizado com sucesso!`;

          // Opcional: Se quiser atualizar o Store com a nova lista/objeto editado
          // commit('UPDATE_SPECIALIST', res.body);

          commit(SET_MESSAGE, successMessage);
          resolve(successMessage);
        },
        err => {
          commit(SET_MESSAGE, err);
          reject(err);
        }
      );
    });
  },
  [REMOVE_SPONSOR]: ({ commit, rootState }, id) => {
    return new Promise((resolve, reject) => {
      sponsorService.removeSponsor(rootState.auth.token, id).then(
        res => {
          commit(SET_MESSAGE, `O patrocinador foi removido com sucesso!`);
          resolve(res);
        },
        err => {
          commit(SET_MESSAGE, err.message);
          reject(err);
        }
      );
    });
  }
};

export const mutations = {
  [SET_SPONSORS]: (state, sponsors) => {
    state.sponsors = sponsors;
  },
  [SET_MESSAGE]: (state, message) => {
    state.message = message;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
