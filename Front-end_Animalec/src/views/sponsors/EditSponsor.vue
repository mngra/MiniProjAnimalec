<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Editar Patrocinador" />

      <b-row>
        <b-col class="d-none d-lg-block" lg="1"></b-col>

        <b-col cols="12" lg="10">
          <form @submit.prevent="update" id="sponsorForm" class="pb-5">
            <b-row>
              <b-col cols="12" lg="8" class="order-2 order-lg-1">
                <div class="form-group">
                  <input
                    v-model="sponsor.name"
                    type="text"
                    class="form-control form-control-lg"
                    id="txtName"
                    placeholder="escreve nome"
                    required
                  />
                </div>
                <b-row>
                  <b-col cols="12" md="6">
                    <div class="form-group">
                      <input
                        v-model="sponsor.startDate"
                        type="date"
                        class="form-control form-control-lg"
                        id="dateInitialDate"
                        placeholder="escreve cursp"
                        required
                      />
                    </div>
                  </b-col>
                  <b-col cols="12" md="6">
                    <div class="form-group">
                      <input
                        v-model="sponsor.endDate"
                        type="date"
                        class="form-control form-control-lg"
                        id="dateFinalDate"
                        placeholder="escreve cursp"
                        required
                      />
                    </div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="12" md="4">
                    <div class="form-group">
                      <select
                        id="sltGroup"
                        class="form-control form-control-lg"
                        v-model="sponsor.type"
                      >
                        <option value disabled>-- TIPO PATROCÍNIO --</option>
                        <option value="pessoal">PESSOAL</option>
                        <option value="institucional">INSTITUCIONAL</option>
                      </select>
                    </div>
                  </b-col>
                  <b-col cols="12" md="4">
                    <div class="form-group">
                      <input
                        v-model.number="sponsor.sponsorshipValue"
                        type="number"
                        class="form-control form-control-lg"
                        id="sponsorshipValue"
                        placeholder="valor do patrocínio"
                        required
                      />
                    </div>
                  </b-col>
                  <b-col cols="12" md="4">
                    <div class="form-group">
                      <select
                        id="sltGroup"
                        class="form-control form-control-lg"
                        v-model="sponsor.state"
                      >
                        <option value disabled>-- SELECIONA ESTADO --</option>
                        <option value="ativo">ATIVO</option>
                        <option value="inativo">INATIVO</option>
                      </select>
                    </div>
                  </b-col>
                </b-row>

                <div class="form-group mt-4 ">
                  <input
                    v-model="sponsor.email"
                    type="email"
                    class="form-control form-control-lg"
                    id="emailValue"
                    placeholder="email"
                    required
                  />
                </div>
              </b-col>

              <b-col
                cols="12"
                lg="4"
                class="order-1 order-lg-2 d-flex flex-column align-items-center justify-content-start"
              >
                <div class="form-group mt-4 text-center">
                  <label for="fileAvatar">Logotipo do Patrocinador </label>
                  <div class="logo-preview-box">
                    <img
                      v-if="logoPreviewUrl || sponsor.logoPath"
                      :src="logoPreviewUrl || sponsor.logoPath"
                      alt="Logotipo Atual"
                      class="logo-img-preview"
                    />
                    <i v-else class="fas fa-image fa-5x text-muted mt-3"></i>
                  </div>

                  <input
                    type="file"
                    @change="handleFileUpload"
                    class="form-control-file mt-2"
                    id="fileAvatar"
                    accept="image/*"
                  />
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="12">
                <div>
                  <h6 class="mt-4">lista de animais de especialização</h6>
                  <div
                    v-for="(specialty, index) in sponsor.animalList"
                    :key="index"
                    class="form-row mb-3"
                  >
                    <div class="col-md-10">
                      <select
                        v-bind:id="'animals-' + index"
                        v-model="sponsor.animalList[index]"
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
                  <h6 class="mt-4">lista de links</h6>
                  <div
                    v-for="(link, index) in sponsor.linkList"
                    :key="'link-' + index"
                    class="form-row mb-3"
                  >
                    <div class="col-md-10">
                      <input
                        v-model="sponsor.linkList[index]"
                        type="text"
                        class="form-control"
                        :placeholder="`Insere o link `"
                        required
                      />
                    </div>

                    <div class="col-md-2">
                      <button
                        @click.prevent="removeLink(index)"
                        class="btn btn-danger"
                      >
                        Remover
                      </button>
                    </div>
                  </div>

                  <button
                    @click.prevent="addLink"
                    class="btn btn-outline-primary mt-2"
                  >
                    + Adicionar Novo Link
                  </button>
                </div>

                <div class="form-group mt-4 ">
                  <textarea
                    id="txtDescription"
                    class="form-control form-control-lg"
                    placeholder="escreve descrição"
                    cols="30"
                    rows="3"
                    v-model="sponsor.description"
                  ></textarea>
                </div>
              </b-col>
            </b-row>

            <div class="form-group mt-4 d-none d-lg-block">
              <button type="submit" class="btn btn-outline-success btn-lg mr-2">
                <i class="fas fa-edit"></i> ATUALIZAR
              </button>

              <router-link
                :to="{ name: 'listSponsors' }"
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
                form="sponsorForm"
                class="btn btn-outline-success mr-2 btn-sm"
              >
                <i class="fas fa-edit"></i> ATUALIZAR
              </button>

              <router-link
                :to="{ name: 'listSponsors' }"
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

<script>
import { FETCH_ANIMALS } from "@/store/animals/animal.constants";
import { EDIT_SPONSOR } from "@/store/sponsors/sponsor.constants";
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
    })
  },
  methods: {    
    handleFileUpload(event) {
      const selectedFile = event.target.files[0];

      if (this.logoPreviewUrl) {
        URL.revokeObjectURL(this.logoPreviewUrl);
      }

      if (selectedFile) {
        this.file = selectedFile;
        this.sponsor.logoPath = null;

        this.logoPreviewUrl = URL.createObjectURL(selectedFile);
      } else {
        this.file = null;
        this.logoPreviewUrl = null;
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
    update() {
      const finalPayload = {
        ...this.sponsor,
        logo: this.file
      };
      this.$store.dispatch(`sponsor/${EDIT_SPONSOR}`, finalPayload).then(
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
