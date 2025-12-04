<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Visualizar Patrocinador" />

      <b-row>
        <b-col class="d-none d-lg-block" lg="2"></b-col>

        <b-col cols="12" lg="12">
          <div class="">
            <div class="logo-container text-center mb-3">
              <img
                :src="require('@/assets/avatars/sponsors/no-image.jpg')"
                alt="Logo do Patrocinador"
                class="current-avatar-img img-fluid rounded"
              />
            </div>

            <p><strong>Email:</strong> {{ sponsor.email || "N/A" }}</p>
            <p>
              <strong>Tipo de Patrocínio:</strong> {{ sponsor.type || "N/A" }}
            </p>
            <p><strong>Valor:</strong> {{ sponsor.sponsorshipValue + " €" }}</p>
            <p>
              <strong>Data início:</strong> {{ sponsor.startDate || "N/A" }}
            </p>
            <p><strong>Data fim:</strong> {{ sponsor.endDate || "N/A" }}</p>
            <p>
              <strong>Estado:</strong>
              <span
                class="badge"
                :class="{
                  'badge-success': sponsor.state === 'ativo',
                  'badge-danger': sponsor.state !== 'ativo'
                }"
              >
                {{ sponsor.state }}
              </span>
            </p>

            <hr />

            <strong>Animais de Especialização:</strong>
            <p v-html="animalListHtml"></p>

            <p><strong>Links:</strong> {{ linkListHtml }}</p>
            <hr />
            <p>
              <strong>Descrição:</strong
              >{{ sponsor.description || "Sem descrição." }}
            </p>
            <hr />
          </div>

          <div class="text-center mb-20">
            <router-link
              :to="{ name: 'listSponsors' }"
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
              @click="removeSponsor(sponsor._id)"
              type="button"
              class="btn btn-outline-danger mr-2 mt-2"
            >
              <i class="fas fa-trash-alt"></i> REMOVER
            </button>
          </div>

          <b-row class="fixed-bottom bg-light border-top p-3 d-lg-none">
            <b-col class="text-center">
              <router-link
                :to="{ name: 'editSponsor', params: { id: sponsor._id } }"
                tag="button"
                class="btn btn-outline-warning mr-2 btn-sm"
                ><i class="fas fa-window-close"></i> ALTERAR
                PATROCINADOR</router-link
              >

              <button
                @click="removeSponsor(sponsor._id)"
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
  EDIT_SPONSOR,
  REMOVE_SPONSOR
} from "@/store/sponsors/sponsor.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import router from "@/router";
import { mapGetters, mapState } from "vuex";

export default {
  name: "EditSponsor",
  components: {
    HeaderPage
  },
  data: () => {
    return {
      sponsor: {},
      file: null, 
      logoPreviewUrl: null
    };
  },
  computed: {
    ...mapGetters("sponsor", ["getSponsorsById", "getMessage"]),
    ...mapState("animal", {
      animals: state => state.animals
    }),
    animalListHtml() {
      const list = this.sponsor.animalList;
      if (Array.isArray(list) && list.length) {
        return `${list.map(animal => `${animal}; `).join("")}`;
      }
      return "Nenhum animal listado.";
    },

    linkListHtml() {
      const list = this.sponsor.linkList;
      if (Array.isArray(list) && list.length) {
        return `${list.map(link => `${link}; `).join("")}`;
      }
      return "Nenhum link disponível.";
    },

    contactListHtml() {
      const list = this.sponsor.contactList;
      if (Array.isArray(list) && list.length) {
        return `${list.map(contact => `${contact}; `).join("")}`;
      }
      return "Nenhum contacto disponível.";
    }
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
      if (this.file) {
        this.logoPreviewUrl = URL.createObjectURL(this.file);
      }
    },
    addAnimal() {
      this.sponsor.animalList.push("");
    },
    removeAnimal(index) {
      this.sponsor.animalList.splice(index, 1);
    },
    addLink() {
      this.sponsor.linkList.push("");
    },
    removeLink(index) {
      this.sponsor.linkList.splice(index, 1);
    },
    addContact() {
      this.sponsor.contactList.push("");
    },
    removeContact(index) {
      this.sponsor.contactList.splice(index, 1);
    },
    removeSponsor(id) {
      this.$confirm(
        "Se sim, clique em OK",
        "Deseja mesmo remover o patrocinador?",
        "warning",
        { confirmButtonText: "OK", cancelButtonText: "Cancelar" }
      ).then(
        () => {
          this.$store.dispatch(`sponsor/${REMOVE_SPONSOR}`, id).then(() => {
            this.$alert(this.getMessage, "Patrocinador removido!", "success");
            router.push({ name: "listSponsors" });
          });
        },
        () => {
          this.$alert("Remoção cancelada!", "Informação", "info");
        }
      );
    },
    update() {
      const sponsorDataToSend = { ...this.sponsor };
      this.$store.dispatch(`sponsor/${EDIT_SPONSOR}`, sponsorDataToSend).then(
        successMessage => {
          this.$alert(successMessage, "Patrocinador atualizado!", "success");
          router.push({ name: "listSponsors" });
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    }
  },
  created() {
    const initialData = this.getSponsorsById(this.$route.params.sponsorId);

    if (initialData) {
      this.sponsor = JSON.parse(JSON.stringify(initialData));

      if (this.sponsor.logo) {
        this.logoPreviewUrl = this.sponsor.logo;
      }
    } else {
      this.sponsor = {
        name: "",
        startDate: "",
        endDate: "",
        type: "",
        sponsorshipValue: 0,
        state: "ativo",
        description: "",
        logo: null,
        animalList: [""],
        linkList: [""],
        contactList: [""]
      };
    }
    this.$store.dispatch(`animal/${FETCH_ANIMALS}`);
  },
  beforeDestroy() {
    if (this.logoPreviewUrl && this.file) {
      URL.revokeObjectURL(this.logoPreviewUrl);
    }
  }
};
</script>

<style scoped>
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
