<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Gestão de Especialistas" />
      <!--MENU TOPO-->
      <b-row class="mb-4">
        <b-col class="d-none d-lg-block" lg="2"></b-col>
        <b-col>
          <router-link
            :to="{ name: 'addSpecialist' }"
            tag="button"
            class="btn btn-outline-success mr-2 mt-2"
          >
            <i class="fas fa-plus-square"></i> ADICIONAR ESPECIALISTA
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
        <b-col cols="2"></b-col>
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
                <!--<th scope="col">NOME</th>-->
                <th scope="col">GRUPO FOCO</th>
                <th scope="col" class="d-none d-md-table-cell">
                  DATA INICIO
                </th>
                <th scope="col" class=" d-none d-md-table-cell">
                  AÇÕES
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="specialist of specialists"
                @click="isMobile ? goToDetails(specialist._id) : null"
                :key="specialist._id"
                class="clickable-row"
              >
                <td class="pt-4">{{ specialist.name }}</td>
                <td class="pt-4">{{ specialist.focusGroup }}</td>
                <td class="pt-4 bg-white d-none d-md-table-cell">
                  {{ specialist.startedAt }}
                </td>
                <td class="d-none d-md-table-cell">
                  <router-link
                    :to="{
                      name: 'editSpecialist',
                      params: { specialistId: specialist._id }
                    }"
                    tag="button"
                    class="btn btn-outline-success mr-2 mt-2"
                  >
                    <i class="fas fa-edit"></i> EDITAR
                  </router-link>
                  <button
                    @click="viewSpecialistBigScreen(specialist._id)"
                    type="button"
                    class="btn btn-outline-success mr-2 mt-2"
                  >
                    <i class="fas fa-search"></i> VER
                  </button>
                  <button
                    @click="removeSpecialist(specialist._id)"
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
<style>
.avatar-display {
  /* Mantenha o display flex e dimensões para o contentor */
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.current-avatar-img {
  width: 180px;
  height: 180px;
  margin: 10px auto;
  object-fit: cover;
}
</style>
<script>
import {
  FETCH_SPECIALISTS,
  REMOVE_SPECIALIST
} from "@/store/specialists/specialist.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import { mapGetters } from "vuex";

export default {
  name: "ManageSpecialists",
  components: {
    HeaderPage
  },
  data: function() {
    return {
      specialists: [],
      sortType: 1
    };
  },
  computed: {
    ...mapGetters("specialist", ["getSpecialists", "getMessage"])
  },
  mounted() {
    this.checkScreenWidth(); // Verifica o tamanho inicial ao carregar
    window.addEventListener("resize", this.checkScreenWidth); // Adiciona o listener
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkScreenWidth);
  },
  methods: {
    fetchSpecialists() {
      this.$store.dispatch(`specialist/${FETCH_SPECIALISTS}`).then(
        () => {
          this.specialists = this.getSpecialists;
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
    goToDetails(id) {
      this.$router.push({
        name: "viewSpecialist",
        params: { specialistId: id }
      });
    },
    sort() {
      this.specialists.sort(this.compareNames);
      this.sortType *= -1;
    },
    compareNames(u1, u2) {
      if (u1.name > u2.name) return 1 * this.sortType;
      else if (u1.name < u2.name) return -1 * this.sortType;
      else return 0;
    },

    viewSpecialistBigScreen(id) {
      const specialist = this.specialists.find(
        specialist => specialist._id === id
      );

      this.$fire({
        title: specialist.name,
        html: this.generateTemplate(specialist)
      });
    },

    generateTemplate(specialist) {
      const contactosList =
        specialist.contacts && specialist.contacts.length > 0
          ? specialist.contacts.map(contact => ` ${contact};`).join("")
          : "Não especificado";
      const context = require.context(
        "@/assets/avatars/specialists",
        false,
        /\.png$/
      );

      const avatarUrl = context(`./av-${specialist.avatar}.png`);

      const specializedAnimalsList =
        specialist.specializedAnimal && specialist.specializedAnimal.length > 0
          ? specialist.specializedAnimal
              .map(specializedAnimal => ` ${specializedAnimal};`)
              .join("")
          : "Não especificado";
      let response = `
          
          <img src= ${avatarUrl}  alt="avatar do especialista" class="current-avatar-img">
          <p><strong>Universidade:</strong> ${specialist.afiliation}</p>
          <p><strong>Curso:</strong> ${specialist.inicialDegree}</p>
          <p><strong>Descrição:</strong> ${specialist.description}</p>
          <p><strong>Grupo de Foco:</strong> ${specialist.focusGroup}</p>
          <p><strong>Animais de especialização:</strong> ${specializedAnimalsList}</p>
          <p><strong>Início:</strong> ${specialist.startedAt}</p>
          <p><strong>Contactos:</strong> ${contactosList} </p>
        `;
      return response;
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
              this.fetchSpecialists();
            });
        },
        () => {
          this.$alert("Remoção cancelada!", "Informação", "info");
        }
      );
    }
  },
  created() {
    this.fetchSpecialists();
  }
};
</script>
