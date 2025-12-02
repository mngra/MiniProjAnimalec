<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Adicionar Especialista" />
      <b-row>
        <b-col class="d-none d-lg-block" lg="1"></b-col>
        <b-col cols="12" lg="10">
          <form @submit.prevent="add">
            <b-row>
              <b-col cols="12" lg="8" class="order-2 order-lg-1">
                <div class="form-group">
                  <input
                    v-model="specialist.name"
                    type="text"
                    class="form-control form-control-lg"
                    id="txtName"
                    placeholder="escreve nome"
                    required
                  />
                </div>
                <div class="form-group">
                  <input
                    v-model="specialist.afiliation"
                    type="text"
                    class="form-control form-control-lg"
                    id="txtAfiliation"
                    placeholder="escreve universidade"
                    required
                  />
                </div>
                <div class="form-group">
                  <input
                    v-model="specialist.inicialDegree"
                    type="text"
                    class="form-control form-control-lg"
                    id="txtInitialDegree"
                    placeholder="escreve curso"
                    required
                  />
                </div>
                <div class="form-group">
                  <input
                    v-model="specialist.startedAt"
                    type="date"
                    class="form-control form-control-lg"
                    id="txtInitialDegree"
                    placeholder="escreve cursp"
                    required
                  />
                </div>
                <div class="form-group">
                  <select
                    id="sltGroup"
                    class="form-control form-control-lg"
                    v-model="specialist.state"
                  >
                    <option value disabled>-- SELECIONA ESTADO --</option>
                    <option value="ativo">ATIVO</option>
                    <option value="inativo">INATIVO</option>
                  </select>
                </div>
                <div class="form-group">
                  <select
                    id="sltGroup"
                    class="form-control form-control-lg"
                    v-model="specialist.focusGroup"
                  >
                    <option selected disabled
                      >-- SELECIONA GRUPO DE FOCO --</option
                    >
                    <option value="Cetáceos">CETÁCEOS</option>
                    <option value="Mamíferos">MAMÍFEROS</option>
                  </select>
                </div>
              </b-col>

              <b-col
                cols="12"
                lg="4"
                class="order-1 order-lg-2 d-flex flex-column align-items-center justify-content-start"
              >
                <div class="form-group mt-4">
                  <label>Escolha o Avatar:</label>
                  <div
                    class="avatar-slider d-flex align-items-center justify-content-center"
                  >
                    <button
                      @click.prevent="prevAvatar"
                      class="btn btn-light slider-btn mr-2"
                    >
                      <i class="fas fa-arrow-left"></i>
                    </button>

                    <div class="avatar-display">
                      <img
                        :src="currentAvatar.url"
                        :alt="currentAvatar.alt"
                        class="current-avatar-img"
                      />
                    </div>

                    <button
                      @click.prevent="nextAvatar"
                      class="btn btn-light slider-btn ml-2"
                    >
                      <i class="fas fa-arrow-right"></i>
                    </button>
                  </div>
                  
                </div>
              </b-col>
            </b-row>
            <div>
              <h6 class="mt-4">lista de animais de especialização</h6>
              <div
                v-for="(specialty, index) in specialist.specializedAnimal"
                :key="index"
                class="form-row mb-3"
              >
                <div class="col-md-10">
                  <select
                    v-bind:id="'animals-' + index"
                    v-model="specialist.specializedAnimal[index]"
                    class="form-control form-control-lg"
                  >
                    <option value disabled>-- Seleciona Animal --</option>
                    <option
                      v-for="availableAnimal in animals"
                      :key="availableAnimal.id"
                      :value="availableAnimal.name"
                    >
                      {{ availableAnimal.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-2">
                  <button
                    @click.prevent="removeAnimal(index)"
                    class="btn btn-danger"
                  >
                    Remover
                  </button>
                </div>
              </div>

              <button
                @click.prevent="addAnimal"
                class="btn btn-outline-primary mt-2"
              >
                + Adicionar Novo Animal
              </button>
            </div>

            <div>
              <h6 class="mt-4">lista de contactos</h6>
              <div
                v-for="(contact, index) in specialist.contacts"
                :key="index"
                class="form-row mb-3"
              >
                <div class="col-md-10">
                  <input
                    v-model="specialist.contacts[index].value"
                    type="text"
                    class="form-control"
                    :placeholder="`Insere o contacto `"
                    required
                  />
                </div>

                <div class="col-md-2">
                  <button
                    v-if="specialist.contacts.length > 1"
                    @click.prevent="removeContact(index)"
                    class="btn btn-danger"
                  >
                    Remover
                  </button>
                </div>
              </div>

              <button
                @click.prevent="addContact"
                class="btn btn-outline-primary mt-2"
              >
                + Adicionar Novo Contacto
              </button>
            </div>
            <div class="form-group mt-4 ">
              <textarea
                id="txtDescription"
                class="form-control form-control-lg"
                placeholder="escreve descrição"
                cols="30"
                rows="3"
                v-model="specialist.description"
                required
              ></textarea>
            </div>            
            <b-row class="fixed-bottom bg-light border-top p-3 d-lg-none">
              <b-col class="text-center">
                <button type="submit" class="btn btn-outline-success btn-lg mr-2">
                  <i class="fas fa-plus-square"></i> ADICIONAR
                </button>
                <router-link
                  :to="{ name: 'listSpecialists' }"
                  tag="button"
                  class="btn btn-outline-danger btn-lg"
                  ><i class="fas fa-window-close"></i> CANCELAR</router-link
                >
                </b-col>
              </b-row>
          </form>
        </b-col>
        <b-col class="d-none d-lg-block" lg="1"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { FETCH_ANIMALS } from "@/store/animals/animal.constants";
import { ADD_SPECIALIST } from "@/store/specialists/specialist.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import router from "@/router";
import { mapGetters, mapState } from "vuex";

export default {
  name: "AddSpecialist",
  components: {
    HeaderPage
  },
  data() {
    return {
      // ✅ NOVO: Objeto principal que detém todos os dados do formulário
      specialist: {
        name: "",
        afiliation: "",
        inicialDegree: "",
        startedAt: "",
        state: "ativo", // Valor por defeito
        focusGroup: null, // Placeholder para o select
        description: "",
        contacts: [{ id: Date.now(), value: "" }], // Inicializa com 1 contacto vazio
        specializedAnimal: [],
        avatar: 1 // ✅ NOVO: ID inicial do avatar
      },
      predefinedAvatars: [
        {
          id: 1,
          url: require("@/assets/avatars/specialists/av-1.png"),
          alt: "Avatar Azul"
        },
        {
          id: 2,
          url: require("@/assets/avatars/specialists/av-2.png"),
          alt: "Avatar Verde"
        },
        {
          id: 3,
          url: require("@/assets/avatars/specialists/av-3.png"),
          alt: "Avatar Roxo"
        }
      ],

      // ✅ MODIFICADO: Começa no index 0 (que corresponde ao ID 1, o primeiro avatar)
      currentAvatarIndex: 0
    };
  },
  computed: {
    ...mapGetters("specialist", ["getMessage"]),
    ...mapState("animal", {
      animals: state => state.animals
    }),
    currentAvatar() {
      if (this.predefinedAvatars.length === 0)
        return { id: null, url: "", alt: "" };
      return this.predefinedAvatars[this.currentAvatarIndex];
    }
  },
  methods: {
    // ✅ MODIFICADO: Métodos de Contacts corrigidos para usar this.specialist.contacts
    addContact() {
      this.specialist.contacts.push({
        id: Date.now(),
        value: ""
      });
    },
    removeContact(index) {
      this.specialist.contacts.splice(index, 1);
    },
    // ✅ MODIFICADO: Métodos de Animals corrigidos para usar this.specialist.specializedAnimal
    addAnimal() {
      // Adicionar 'null' permite que o <select> comece sem valor selecionado
      this.specialist.specializedAnimal.push(null);
    },
    removeAnimal(index) {
      this.specialist.specializedAnimal.splice(index, 1);
    },
    // ✅ AVATAR: Mapeia o ID atual do avatar para o objeto specialist
    selectAvatar() {
      this.specialist.avatar = this.currentAvatar.id;
    },
    // ✅ AVATAR: Navegação para o anterior
    prevAvatar() {
      const lastIndex = this.predefinedAvatars.length - 1;
      this.currentAvatarIndex =
        this.currentAvatarIndex > 0 ? this.currentAvatarIndex - 1 : lastIndex;
      this.selectAvatar();
    },
    // ✅ AVATAR: Navegação para o próximo
    nextAvatar() {
      this.currentAvatarIndex =
        (this.currentAvatarIndex + 1) % this.predefinedAvatars.length;
      this.selectAvatar();
    },

    // ✅ MODIFICADO: Formata os dados antes de enviar
    add() {
      // 1. Clonar o objeto specialist para formatação
      const specialistDataToSend = { ...this.specialist };

      // 2. Formatar Contactos: Converter array de objetos [{ value: '...' }] para array de strings ['...']
      specialistDataToSend.contacts = specialistDataToSend.contacts
        .map(contact => contact.value)
        .filter(value => value && value.trim() !== ""); // Remover entradas vazias

      // 3. Formatar Animais: Remover seleções nulas/vazias
      specialistDataToSend.specializedAnimal = specialistDataToSend.specializedAnimal.filter(
        animal => animal && animal.trim() !== ""
      );

      // O ID do avatar já está em specialistDataToSend.avatar

      this.$store
        .dispatch(`specialist/${ADD_SPECIALIST}`, specialistDataToSend)
        .then(
          () => {
            this.$alert(this.getMessage, "Especialista adicionado!", "success");
            router.push({ name: "listSpecialists" });
          },
          err => {
            this.$alert(`${err.message}`, "Erro", "error");
          }
        );
    }
  },
  created() {
    // 1. Despachar a Ação para carregar os Animais.
    // O resultado será acessado REATIVAMENTE via this.animals (mapState).
    this.$store.dispatch(`animal/${FETCH_ANIMALS}`);

    // 2. Garante que o ID do avatar inicial (ID 1) está definido no objeto
    this.selectAvatar();
  }
};
</script>
