<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Gestão de Patrocinadores" />
      <!--MENU TOPO-->
      <b-row class="mb-4">
        <b-col class="d-none d-lg-block" lg="2"></b-col>
        <b-col>
          <router-link
            :to="{ name: 'addSponsor' }"
            tag="button"
            class="btn btn-outline-success mr-2 mt-2"
          >
            <i class="fas fa-plus-square"></i> ADICIONAR PATROCINADOR
          </router-link>
          <router-link
            :to="{ name: 'admin' }"
            tag="button"
            class="btn btn-outline-info mr-2 mt-2"
          >
            <i class="fas fa-bars"></i> MENU PRINCIPAL
          </router-link>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>

      <!--TABLE-->
      <b-row>
        <b-col class="d-none d-lg-block" lg="2"></b-col>
        <b-col>
          <table class="table table-striped">
            <thead class="thead-dark">
              <tr>
                <th scope="col">
                  NOME
                  <i
                    class="fas fa-arrow-up"
                    v-if="sortType === 1"
                    @click="sort()"
                  ></i>
                  <i class="fas fa-arrow-down" v-else @click="sort()"></i>
                </th>
                <th scope="col">
                  TIPO PATROCÍNIO
                </th>
                <th scope="col" class="d-none d-md-table-cell">
                  DATA INÍCIO
                </th>
                <th scope="col" class="d-none d-md-table-cell">
                  AÇÕES
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="sponsor of sponsors"
                :key="sponsor._id"
                @click="isMobile ? goToDetails(sponsor._id) : null"
                class="clickable-row"
              >
                <td class="pt-4">{{ sponsor.name }}</td>
                <td class="pt-4 ">
                  {{ sponsor.type }}
                </td>
                <td class="pt-4 bg-white d-none d-md-table-cell">
                  {{ sponsor.createdAt }}
                </td>
                <td class="d-none d-md-table-cell">
                  <router-link
                    :to="{
                      name: 'editSponsor',
                      params: { sponsorId: sponsor._id }
                    }"
                    tag="button"
                    class="btn btn-outline-success mr-2 mt-2"
                  >
                    <i class="fas fa-edit"></i> EDITAR
                  </router-link>
                  <button
                    @click="viewSponsorBigScreen(sponsor._id)"
                    type="button"
                    class="btn btn-outline-success mr-2 mt-2"
                  >
                    <i class="fas fa-search"></i> VER
                  </button>
                  <button
                    @click="removeSponsor(sponsor._id)"
                    type="button"
                    class="btn btn-outline-danger mr-2 mt-2"
                  >
                    <i class="fas fa-trash-alt"></i> REMOVER
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import {
  FETCH_SPONSORS,
  REMOVE_SPONSOR
} from "@/store/sponsors/sponsor.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import { mapGetters } from "vuex";

export default {
  name: "ManageSponsors",
  components: {
    HeaderPage
  },
  data: function() {
    return {
      sponsors: [],
      sortType: 1,
      isMobile: false
    };
  },
  computed: {
    ...mapGetters("sponsor", ["getSponsors", "getMessage"])
  },
  mounted() {
    this.checkScreenWidth(); // Verifica o tamanho inicial ao carregar
    window.addEventListener("resize", this.checkScreenWidth); // Adiciona o listener
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkScreenWidth);
  },
  methods: {
    fetchSponsors() {
      this.$store.dispatch(`sponsor/${FETCH_SPONSORS}`).then(
        () => {
          this.sponsors = this.getSponsors;
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    },
    checkScreenWidth() {
      // Define mobile como ecrãs menores que 768px (o breakpoint 'md' do Bootstrap)
      this.isMobile = window.innerWidth < 768;
    },
    sort() {
      this.sponsors.sort(this.compareNames);
      this.sortType *= -1;
    },
    compareNames(u1, u2) {
      if (u1.name > u2.name) return 1 * this.sortType;
      else if (u1.name < u2.name) return -1 * this.sortType;
      else return 0;
    },
    goToDetails(id) {
      this.$router.push({
        name: "viewSponsor",
        params: { sponsorId: id }
      });
    },
    viewSponsorBigScreen(id) {
      const sponsor = this.sponsors.find(sponsor => sponsor._id === id);
      this.$fire({
        title: sponsor.name,
        html: this.generateTemplate(sponsor)
      });
    },

    generateTemplate(sponsor) {
      // Funções auxiliares para formatar listas (assumindo arrays de strings)
      const animalListHtml = Array.isArray(sponsor.animalList)
        ? `${sponsor.animalList.map(animal => `${animal}; `).join("")}`
        : "<p>Nenhum animal listado.</p>";

      const linkListHtml = Array.isArray(sponsor.linkList)
        ? `${sponsor.linkList.map(link => `${link}; `).join("")}`
        : "<p>Nenhum link disponível.</p>";

      const contactListHtml = Array.isArray(sponsor.contactList)
        ? `${sponsor.contactList.map(contact => `${contact}; `).join("")}`
        : "<p>Nenhum contacto disponível.</p>";
      const logo = require("@/assets/avatars/sponsors/no-image.jpg");
      if (sponsor.logoPath == undefined || sponsor.logoPath == "") {
        sponsor.logoPath = logo;
      }
      let response = `
        <div class="sponsor-details-content">
            
            <div class="logo-container text-center mb-3">
                <img src="${sponsor.logoPath}" 
                     alt="Logo do Patrocinador" 
                     class="current-avatar-img img-fluid rounded">
            </div>

            <p><strong>Email:</strong> ${sponsor.email || "N/A"} </p>
            <p><strong>Tipo de Patrocínio:</strong> ${sponsor.type || "N/A"}</p>
            <p><strong>Valor:</strong> ${sponsor.sponsorshipValue + " €"} </p>
            <p><strong>Data início:</strong> ${sponsor.startDate || "N/A"}</p>
            <p><strong>Data fim:</strong> ${sponsor.endDate || "N/A"}</p>
            <p><strong>Estado:</strong> <span class="badge badge-${
              sponsor.state === "ativo" ? "success" : "danger"
            }">${sponsor.state ? sponsor.state.toUpperCase() : "N/A"}</span></p>
            
            <hr>
            <p><strong>Animais de Especialização:</strong>${animalListHtml}</p>
            <p><strong>Links:</strong> ${linkListHtml} </p>
            <p><strong>Contactos:</strong> ${contactListHtml} </p>
            <hr>
            <p><strong>Descrição:</strong>${sponsor.description ||
              "Sem descrição."}</p>
            <hr>
        </div>
      `;
      return response;
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
            this.fetchSponsors();
          });
        },
        () => {
          this.$alert("Remoção cancelada!", "Informação", "info");
        }
      );
    }
  },
  created() {
    this.fetchSponsors();
  }
};
</script>
