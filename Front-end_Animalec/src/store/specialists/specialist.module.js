import specialistService from "@/api/specialist.service";
import {
  // Actions
  FETCH_SPECIALISTS,
  ADD_SPECIALIST,
  EDIT_SPECIALIST,
  REMOVE_SPECIALIST,
  // Mutations
  SET_SPECIALISTS,
  SET_MESSAGE
} from "./specialist.constants";

const state = {
  specialists: []
};

const getters = {
  getSpecialists: state => state.specialists,
  getSpecialistsById: state => id =>
    state.specialists.find(specialist => specialist._id === id),
  getMessage: state => state.message
};

const actions = {
  [FETCH_SPECIALISTS]: ({ commit, rootState }) => {
    return new Promise((resolve, reject) => {
      specialistService.getSpecialists(rootState.auth.token).then(
        res => {
          const modifiedSpecialists = res.body.map(specialist => {
            // Verifica se o especialista tem um campo 'startedAt'
            if (specialist.startedAt) {
              // Modifica o campo 'startedAt'
              specialist.startedAt = specialist.startedAt.split("T")[0];
            }
            return specialist;
          });
          commit(SET_SPECIALISTS, modifiedSpecialists);
          resolve(res);
        },
        err => {
          commit(SET_MESSAGE, err.message);
          reject(err);
        }
      );
    });
  },
  [ADD_SPECIALIST]: ({ commit, rootState }, payload) => {
    return new Promise((resolve, reject) => {
      specialistService.addSpecialist(rootState.auth.token, payload).then(
        res => {
          commit(
            SET_MESSAGE,
            `O especialista ${res.body.name} foi adicionado com sucesso!`
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
  [EDIT_SPECIALIST]: ({ commit, rootState }, payload) => {
    // O payload é o objeto especialista com o nome correto (ex: payload.name)
    const specialistName = payload.name;

    return new Promise((resolve, reject) => {
      specialistService.editSpecialist(rootState.auth.token, payload).then(
        () => {
          // CORRIGIDO: Usar o nome do objeto que enviamos (payload)
          const successMessage = `O especialista ${specialistName} foi atualizado com sucesso!`;

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
  [REMOVE_SPECIALIST]: ({ commit, rootState }, id) => {
    return new Promise((resolve, reject) => {
      specialistService.removeSpecialist(rootState.auth.token, id).then(
        res => {
          commit(SET_MESSAGE, `O especialista foi removido com sucesso!`);
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
  [SET_SPECIALISTS]: (state, specialists) => {
    state.specialists = specialists;
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
