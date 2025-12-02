<template>
  
    <b-card
      :title="sponsor.name"
      
      img-alt="Image"
      img-top
      tag="article"
      style="width: 20rem;"
      class="mb-5 mr-4"
    >
      <b-card-text>
        <!--<kbd>{{ animal.group }}</kbd>&nbsp;
        <kbd style="background-color: red">nível {{ animal.level }}</kbd> -->
      </b-card-text>
      <b-card-text>{{sponsor.name}}</b-card-text>
      <b-card-text>{{sponsor.type}}</b-card-text>
      <b-card-text>{{sponsor.state}}</b-card-text>

      
      
    </b-card>
  
</template>

<script>
//import { EDIT_ANIMAL } from "@/store/animals/animal.constants";
import { mapGetters } from "vuex";

export default {
  name: "Sponsor",
  props: ["sponsor"],
  data: function() {
    return {
    };
  },
  methods: {
    ...mapGetters("auth", ["getProfile"]),
    
  }
};
</script>
