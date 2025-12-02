<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Patrocinadores" />
      <b-row>

      <div class="form-group mb-5">
          <input
            class="form-control form-control-lg"
            type="text"
            placeholder="procura pelo nome..."
            v-model="filterName"
          />
        </div>
        <div class="form-group mx-sm-3 mb-5">
          <select class="form-control form-control-lg" v-model="filterType">
            <option value=""></option>
            <option value="pessoal">Pessoal</option>
            <option value="institucional">Institucional</option>
          </select>
        </div>
      </b-row>

      <div class="row">
        <Sponsor v-for="s in filteredSponsors" :key="s.id" :sponsor="s"></Sponsor>
      </div>
    </b-container>
  </section>
</template>

<script>
import Sponsor from "@/components/Sponsor.vue";
import HeaderPage from "@/components/HeaderPage.vue";
import { FETCH_SPONSORS } from "@/store/sponsors/sponsor.constants";

import { mapGetters } from "vuex";

export default {
  name: "listSponsors",
  components: {
    HeaderPage,
    Sponsor
  },
  data: function() {
    return {
      sponsors: [],
      filterName: "",
      filterType: ""
    };
  },
  computed: {
    ...mapGetters("auth", ["getProfile"]),
    ...mapGetters("sponsor", ["getSponsors", "getMessage"]),
    classSorter() {
      return {
        "fas fa-sort-alpha-up": !this.reverse,
        "fas fa-sort-alpha-down": this.reverse
      };
    },
    filteredSponsors() {
      return this.sponsors.filter(sponsor => {
        let filterNameResult = true,
          filterTypeResult = true;
        if (this.filterName != "") {
          filterNameResult = sponsor.name.includes(this.filterName);
        }
        if (this.filterType != "") {
          filterTypeResult = sponsor.type.includes(this.filterType);
        }
        
        return filterNameResult && filterTypeResult;
      });
    }
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
    }
  },
  created() {
    this.fetchSponsors();
  }
};
</script>
