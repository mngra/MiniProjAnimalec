<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Especialistas" />
      <b-row>
        <!--FILTRO-->
        <div class="form-group mb-5">
          <input
            class="form-control form-control-lg"
            type="text"
            placeholder="procura pelo nome..."
            v-model="filterName"
          />
        </div>
        <div class="form-group mx-sm-3 mb-5">
          <select class="form-control form-control-lg" v-model="filterGroup">
            <option value="todos">todos os grupos</option>
            <option value="anfíbio">anfíbios</option>
            <option value="ave">aves</option>
            <option value="mamífero">mamíferos</option>
            <option value="peixe">peixes</option>
            <option value="réptil">répteis</option>
          </select>
        </div>
      </b-row>
      <div class="row">
        <Specialist v-for="s in filteredSpecialists" :key="s.id" :specialist="s"></Specialist>
      </div>
    </b-container>
  </section>
</template>

<script>
import Specialist from "@/components/Specialist.vue";
import HeaderPage from "@/components/HeaderPage.vue";
import { FETCH_SPECIALISTS } from "@/store/specialists/specialist.constants";

import { mapGetters } from "vuex";

export default {
  name: "listSpecialists",
  components: {
    HeaderPage,
    Specialist
  },
  data: function() {
    return {
      filterGroup: "todos",
      filterName: "",
      specialists: []
    };
  },
  computed: {
    ...mapGetters("auth", ["getProfile"]),
    ...mapGetters("specialist", ["getSpecialists", "getMessage"]),
    classSorter() {
      return {
        "fas fa-sort-alpha-up": !this.reverse,
        "fas fa-sort-alpha-down": this.reverse
      };
    },
    filteredSpecialists() {
      return this.specialists.filter(specialist => {
        let filterNameResult = true,
          filterGroupResult = true;
        if (this.filterName != "") {
          filterNameResult = specialist.name.includes(this.filterName);
        }
        if (this.filterGroup != "todos") {
          filterGroupResult = specialist.group == this.filterGroup;
        }
        return filterNameResult && filterGroupResult;
      });
    }
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
    sortSpecialists() {
      this.animals.sort(this.compareAnimalNames);
      this.reverse = !this.reverse;
    }
  },
  created() {
    this.fetchSpecialists();
  }
};
</script>
