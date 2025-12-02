<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Visualizar Especialista" />

      <b-row>
        <b-col class="d-none d-lg-block" lg="2"></b-col>

        <b-col cols="12" lg="12">
          <!--<div class="">-->
          <div class="form-group mt-2">
            <div
              class="avatar-slider d-flex align-items-center justify-content-center"
            >
              <div class="avatar-display">
                <img
                  :src="currentAvatar.url"
                  :alt="currentAvatar.alt"
                  class="current-avatar-img"
                />
              </div>
            </div>
          </div>
          <p><strong>Nome:</strong> {{ specialist.name || "N/A" }}</p>
          <p>
            <strong>Universidade:</strong> {{ specialist.afiliation || "N/A" }}
          </p>
          <p><strong>Curso:</strong> {{ specialist.inicialDegree || "N/A" }}</p>
          <p>
            <strong>Descrição:</strong> {{ specialist.description || "N/A" }}
          </p>
          <p>
            <strong>Grupo de foco:</strong> {{ specialist.focusGroup || "N/A" }}
          </p>
          <hr />

          <strong>Animais de Especialização:</strong>
          <p v-html="animalListHtml"></p>

          <p><strong>Contactos:</strong> {{ contactListHtml }}</p>
          <hr />

          <hr />

          <div class="text-center mb-20">
            <router-link
              :to="{ name: 'listSpecialists' }"
              tag="button"
              class="btn swal2-styled swal2-confirm mr-2 btn-sm"
            >
              VOLTAR
            </router-link>
          </div>

          <div class="form-group mt-4 d-none d-lg-block">
            <button type="submit" class="btn btn-outline-success btn-lg mr-2">
              <i class="fas fa-edit"></i> ATUALIZAR
            </button>

            <button
              @click="removeSpecialist(specialist._id)"
              type="button"
              class="btn btn-outline-danger mr-2 mt-2"
            >
              <i class="fas fa-trash-alt"></i> REMOVER
            </button>
          </div>
          <b-row class="fixed-bottom bg-light border-top p-3 d-lg-none">
            <b-col class="text-center">
              <router-link
                :to="{ name: 'editSpecialist', params: { id: specialist._id } }"
                tag="button"
                class="btn btn-outline-warning mr-2 btn-sm"
                ><i class="fas fa-window-close"></i> ALTERAR
                ESPECIALISTA</router-link
              >

              <button
                @click="removeSpecialist(specialist._id)"
                type="button"
                class="btn btn-outline-danger mr-2 btn-sm"
              >
                <i class="fas fa-trash-alt"></i> Eliminar
              </button>
            </b-col>
          </b-row>
        </b-col>
        <b-col class="d-none d-lg-block" lg="1"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { FETCH_ANIMALS } from "@/store/animals/animal.constants";
import {
  EDIT_SPECIALIST,
  REMOVE_SPECIALIST
} from "@/store/specialists/specialist.constants";
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
    },
    animalListHtml() {
      // Usa this.sponsor.animalList, que é reativo
      const list = this.specialist.specializedAnimal;
      if (Array.isArray(list) && list.length) {
        return `${list.map(animal => `${animal}; `).join("")}`;
      }
      return "Nenhum animal listado.";
    },

    // Calcula a lista de contactos formatada como HTML
    contactListHtml() {
      const list = this.specialist.contacts;
      if (Array.isArray(list) && list.length) {
        return `${list.map(contact => `${contact}; `).join("")}`;
      }
      return "Nenhum contacto disponível.";
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
    // Adição e Remoção de Animais
    addAnimal() {
      // Garante que o animalList é um array de strings (assumindo o v-model)
      this.specialist.animalList.push("");
    },
    removeAnimal(index) {
      this.specialist.animalList.splice(index, 1);
    },
    // Adição e Remoção de Links
    addLink() {
      this.specialist.linkList.push("");
    },
    removeLink(index) {
      this.specialist.linkList.splice(index, 1);
    },
    // Adição e Remoção de Contactos
    addContact() {
      this.specialist.contactList.push("");
    },
    removeContact(index) {
      this.specialist.contactList.splice(index, 1);
    },
    removeSpecialist(id) {
      this.$confirm(
        "Se sim, clique em OK",
        "Deseja mesmo remover o especialista?",
        "warning",
        { confirmButtonText: "OK", cancelButtonText: "Cancelar" }
      ).then(
        () => {
          this.$store
            .dispatch(`specialist/${REMOVE_SPECIALIST}`, id)
            .then(() => {
              this.$alert(this.getMessage, "Especialista removido!", "success");
              router.push({ name: "listSpecialists" });
            });
        },
        () => {
          this.$alert("Remoção cancelada!", "Informação", "info");
        }
      );
    },
    update() {
      const specialistDataToSend = { ...this.specialist };

      // Se um novo ficheiro foi selecionado, ele deve ser incluído no payload de alguma forma.
      // Dependendo da sua API, pode ser um FormData ou um campo base64, ou simplesmente
      // o processo de upload é separado. Para este exemplo, apenas enviamos os dados
      // do formulário, assumindo que o upload do ficheiro é feito à parte ou que o
      // back-end pode lidar com um campo 'file'.

      this.$store
        .dispatch(`specialist/${EDIT_SPECIALIST}`, specialistDataToSend)
        .then(
          successMessage => {
            this.$alert(successMessage, "Especialista atualizado!", "success");
            router.push({ name: "listSpecialist" });
          },
          err => {
            this.$alert(`${err.message}`, "Erro", "error");
          }
        );
    }
  },
  created() {
    const initialData = this.getSpecialistsById(
      this.$route.params.specialistId
    );

    if (initialData) {
      // Criar uma cópia profunda para edição reativa
      this.specialist = JSON.parse(JSON.stringify(initialData));
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
      // Caso não encontre, inicializa as listas vazias como arrays de strings vazias
      this.specialist = {
        name: "",
        afiliation: "",
        initialDegree: "",
        startedAt: "",
        state: "ativo",
        description: "",
        focusGroup: "",
        animalList: [""],
        contactList: [""]
      };
    }
    this.$store.dispatch(`animal/${FETCH_ANIMALS}`);
  },
  beforeDestroy() {
    // Limpa o URL de pré-visualização do objeto blob para evitar vazamentos de memória
    if (this.logoPreviewUrl && this.file) {
      URL.revokeObjectURL(this.logoPreviewUrl);
    }
  }
};
</script>

<style scoped>
/* Adicionado estilo para a caixa de visualização do logotipo */
.logo-preview-box {
  width: 150px;
  height: 150px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px auto;
  overflow: hidden;
}

.logo-img-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.center_div {
  margin: 0 auto;
  width: 80%;
}
</style>
