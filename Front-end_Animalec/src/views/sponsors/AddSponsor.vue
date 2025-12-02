<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Adicionar Patrocinador" />

      <b-row>
        <b-col class="d-none d-lg-block" lg="1"></b-col>

        <b-col cols="12" lg="10">
          <form @submit.prevent="add">
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
                  <div class="form-group">
                    <input
                      v-model="sponsor.email"
                      type="email"
                      class="form-control form-control-lg"
                      id="emailValue"
                      placeholder="email"
                      required
                    />
                  </div>
                </div>
              </b-col>

              <b-col
                cols="12"
                lg="4"
                class="order-1 order-lg-2 d-flex flex-column align-items-center justify-content-start"
              >
                <div class="form-group mt-4 text-center">
                  <label for="fileAvatar">Logotipo do Patrocinador</label>
                  <div class="logo-preview-box">
                    <!--<img
                      v-if="logo || file"
                      :src="logoPreviewUrl"
                      alt="Logotipo Atual"
                      class="logo-img-preview"
                    />
                    <i v-else class="fas fa-image fa-5x text-muted mt-3"></i>-->
                  </div>

                  <!--<input
                    type="file"
                    @change="handleFileUpload"
                    class="form-control-file mt-2"
                    id="fileAvatar"
                    accept="image/*"
                  />
                  <p v-if="sponsor.file" class="small text-muted mt-1">
                    Ficheiro selecionado: 
                  </p>
                  <p v-else-if="logo" class="small text-muted mt-1">
                    Logo atual
                  </p>-->
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
                <!--<div>
                  <h6 class="mt-4">lista de contactos</h6>
                  <div
                    v-for="(contact, index) in sponsor.contactList"
                    :key="'contact-' + index"
                    class="form-row mb-3"
                  >
                    <div class="col-md-10">
                      <input
                        v-model="sponsor.contactList[index]"
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
                </div> -->

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
                <i class="fas fa-edit"></i> ADICIONAR
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

            <b-row class="fixed-bottom bg-light border-top p-3 d-lg-none">
              <b-col class="text-center">
                <button
                  type="submit"
                  class="btn btn-outline-success mr-2 btn-sm"
                >
                  <i class="fas fa-edit"></i> ADICIONAR
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
          </form>
        </b-col>

        <b-col class="d-none d-lg-block" lg="1"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { FETCH_ANIMALS } from "@/store/animals/animal.constants";
import { ADD_SPONSOR } from "@/store/sponsors/sponsor.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import router from "@/router";
import { mapGetters, mapState } from "vuex";
import dayjs from "dayjs";

export default {
  name: "AddSponsor",
  components: {
    HeaderPage
  },
  data: () => {
    return {
      sponsor: {
        name: "",
        type: "",
        sponsorshipValue: "",
        state: "ativo",
        email: "",
        description: "",
        animalList: [],
        linkList: [],
        startDate: dayjs().format("YYYY-MM-DD"),
        endDate: dayjs()
          .add(1, "year")
          .format("YYYY-MM-DD")
      }
    };
  },
  computed: {
    ...mapGetters("sponsor", ["getMessage"]),
    ...mapState("animal", {
      animals: state => state.animals
    })
  },
  methods: {
    // Adição e Remoção de Animais
    addAnimal() {
      // Garante que o animalList é um array de strings (assumindo o v-model)
      this.sponsor.animalList.push("");
    },
    removeAnimal(index) {
      this.sponsor.animalList.splice(index, 1);
    },
    // Adição e Remoção de Links
    addLink() {
      this.sponsor.linkList.push("");
    },
    removeLink(index) {
      this.sponsor.linkList.splice(index, 1);
    },
    // Adição e Remoção de Contactos
    addContact() {
      this.sponsor.contactList.push("");
    },
    removeContact(index) {
      this.sponsor.contactList.splice(index, 1);
    },
    add() {
      const sponsorDataToSend = { ...this.sponsor };

      this.$store.dispatch(`sponsor/${ADD_SPONSOR}`, sponsorDataToSend).then(
        () => {
          this.$alert(this.getMessage, "Patrocinador adicionado!", "success");
          router.push({ name: "listSponsors" });
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
  }
};
</script>
