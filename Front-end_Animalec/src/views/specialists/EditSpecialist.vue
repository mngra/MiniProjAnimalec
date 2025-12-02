<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Editar Especialista" />

      <b-row>
        <b-col class="d-none d-lg-block" lg="1"></b-col>

        <b-col cols="12" lg="10">
          <form @submit.prevent="update" id="specialistForm" class="pb-5">
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
                    <option value disabled
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
                class="d-flex flex-column align-items-center justify-content-start order-1 order-lg-2"
              >
                <div class="form-group mt-2">
                  <div
                    class="avatar-slider d-flex align-items-center justify-content-center"
                  >
                    <button
                      @click.prevent="prevAvatar"
                      class="btn btn-light slider-btn"
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
                      class="btn btn-light slider-btn"
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
                    v-model="contact.value"
                    type="text"
                    class="form-control"
                    :placeholder="`Insere o contacto `"
                    required
                  />
                </div>

                <div class="col-md-2">
                  <button
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

            <div class="form-group mt-4 d-none d-lg-block">
              <button type="submit" class="btn btn-outline-success btn-lg mr-2">
                <i class="fas fa-edit"></i> ATUALIZAR
              </button>

              <router-link
                :to="{ name: 'listSpecialists' }"
                v-slot="{ navigate }"
                custom
              >
                <button
                  @click="navigate"
                  type="button"
                  class="btn btn-outline-danger btn-lg"
                >
                  <i class="fas fa-window-close"></i> CANCELAR
                </button>
              </router-link>
            </div>
          </form>

          <b-row class="fixed-bottom bg-light border-top p-3 d-lg-none">
            <b-col class="text-center">
              <button
                type="submit"
                form="specialistForm"
                class="btn btn-outline-success mr-2 btn-sm"
              >
                <i class="fas fa-edit"></i> ATUALIZAR
              </button>

              <router-link
                :to="{ name: 'listSpecialists' }"
                v-slot="{ navigate }"
                custom
              >
                <button
                  @click="navigate"
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                >
                  <i class="fas fa-window-close"></i> CANCELAR
                </button>
              </router-link>
            </b-col>
          </b-row>
        </b-col>
        <b-col class="d-none d-lg-block" lg="1"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<style scoped>
/* Estilos para o carrossel de avatar */
.avatar-display {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.current-avatar-img {
  width: 180px;
  height: 180px;
  object-fit: cover;
}

/* Reduz o tamanho da imagem do avatar em ecrãs muito pequenos */
@media (max-width: 575.98px) {
  .avatar-display {
    width: 150px;
    height: 150px;
  }
  .current-avatar-img {
    width: 130px;
    height: 130px;
  }
}

.center_div {
  margin: 0 auto;
  width: 80%;
}
</style>

<script>
import { FETCH_ANIMALS } from "@/store/animals/animal.constants";
import { EDIT_SPECIALIST } from "@/store/specialists/specialist.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import router from "@/router";
import { mapGetters, mapState } from "vuex";

export default {
  name: "EditSpecialist",
  components: {
    HeaderPage
  },
  data: () => {
    return {
      specialist: {},
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
        // Adicione URLs de avatares reais aqui
      ],

      currentAvatarIndex: 0
    };
  },
  computed: {
    ...mapGetters("specialist", ["getSpecialistsById", "getMessage"]),
    ...mapState("animal", {
      animals: state => state.animals
    }),
    currentAvatar() {
      // Garantir que não há erro se a lista estiver vazia
      if (this.predefinedAvatars.length === 0)
        return { id: null, url: "", alt: "" };
      return this.predefinedAvatars[this.currentAvatarIndex];
    }
  },
  methods: {
    // AVATAR: Salva o ID do avatar selecionado no modelo
    selectAvatar() {
      this.specialist.avatar = this.currentAvatar.id;
    },
    // AVATAR: Navegação para o anterior
    prevAvatar() {
      const lastIndex = this.predefinedAvatars.length - 1;
      this.currentAvatarIndex =
        this.currentAvatarIndex > 0 ? this.currentAvatarIndex - 1 : lastIndex;
      this.selectAvatar();
    },
    // AVATAR: Navegação para o próximo
    nextAvatar() {
      this.currentAvatarIndex =
        (this.currentAvatarIndex + 1) % this.predefinedAvatars.length;
      this.selectAvatar();
    },
    addContact() {
      // O Vue detecta esta mudança e o v-for renderiza uma nova linha.
      this.specialist.contacts.push({
        id: Date.now(),
        value: ""
      });
    },
    addAnimal() {
      // O Vue detecta esta mudança e o v-for renderiza uma nova linha.
      this.specialist.specializedAnimal.push({
        id: Date.now(),
        value: ""
      });
    },
    parseContacts(contactStrings) {
      // Se os dados não vierem ou não forem um array, inicializa com um campo vazio
      if (!Array.isArray(contactStrings) || contactStrings.length === 0) {
        // Inicializa o formulário com um campo vazio para o utilizador começar a adicionar
        return [{ id: Date.now(), value: "" }];
      }

      // Mapeia cada string para o formato de objeto { id, value }
      return contactStrings.map(contactString => {
        return {
          id: Date.now() + Math.random(), // Garante um ID único
          value: contactString || ""
        };
      });
    },
    removeContact(index) {
      this.specialist.contacts.splice(index, 1);
    },
    removeAnimal(index) {
      this.specialist.specializedAnimal.splice(index, 1);
    },
    update() {
      const specialistDataToSend = { ...this.specialist };

      specialistDataToSend.contacts = specialistDataToSend.contacts
        .map(contact => {
          if (contact.value) {
            return `${contact.value}`;
          }
          return "";
        })
        .filter(contactString => contactString !== "");

      specialistDataToSend.specializedAnimal = specialistDataToSend.specializedAnimal
        .map(animal => {
          // O value é o nome do animal selecionado no <select>
          return animal.value;
        })
        .filter(animalName => animalName && animalName !== ""); // Filtra vazios ou nulos

      this.$store
        .dispatch(`specialist/${EDIT_SPECIALIST}`, specialistDataToSend)
        .then(
          successMessage => {
            this.$alert(successMessage, "Especialista atualizado!", "success");
            router.push({ name: "listSpecialists" });
          },
          err => {
            this.$alert(`${err.message}`, "Erro", "error");
          }
        );
    }
  },
  created() {
    // 1. Obter os dados brutos do especialista (Array de Strings)
    const specialistData = this.getSpecialistsById(
      this.$route.params.specialistId
    );

    if (specialistData) {
      // 2. Pré-processar a propriedade 'contacts'
      const processedContacts = this.parseContacts(specialistData.contacts);

      // 3. Atribuir os dados clonados E processados
      this.specialist = {
        ...specialistData,
        contacts: processedContacts, // Usa o array de objetos { id, value }
        avatar: specialistData.avatar || null
      };
      // 3. AVATAR: Inicializar o carrossel na posição correta
      if (this.specialist.avatar) {
        // Encontra o índice no array de avatares com base no ID guardado
        const index = this.predefinedAvatars.findIndex(
          a => a.id === this.specialist.avatar
        );
        this.currentAvatarIndex = index !== -1 ? index : 0;
      } else {
        // Se não houver avatar salvo, inicializa no primeiro e salva o ID 1
        this.currentAvatarIndex = 0;
        this.selectAvatar();
      }
    } else {
      // Caso não encontre o especialista, inicializa os contactos vazios
      this.specialist = {
        contacts: this.parseContacts([]),
        specializedAnimal: [],
        avatar: null
      };
      // Inicializa o carrossel no primeiro avatar
      this.currentAvatarIndex = 0;
      this.selectAvatar();
    }

    // 2. Despachar a Ação para carregar os Animais.
    // O resultado será acessado REATIVAMENTE via this.animalsList (mapState).
    this.$store.dispatch(`animal/${FETCH_ANIMALS}`);
  }
};
</script>
