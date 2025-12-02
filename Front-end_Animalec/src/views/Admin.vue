<template>
  <section class="page-section">
    <b-container fluid>
      <HeaderPage title="Gestão do Animalec"/>

      <b-row>
        <b-col cols="3"></b-col>
        <b-col cols="6">
          <b-card-group deck>
            <AdminOptionBox routeName="listUsers" iconName="users" title="Utilizadores"/>
            <AdminOptionBox routeName="listAnimals" iconName="dog"  title="Animais"/>
            <AdminOptionBox routeName="listSponsors" iconName="award"  title="Patrocinadores"/>
          </b-card-group>
          <b-card-group deck class="mt-3">
            <AdminOptionBox routeName="listSpecialists" iconName="hands"  title="Especialistas"/>
            <AdminOptionBox routeName="listQuizzes" iconName="file-alt"  title="Quizzes"/>
            <AdminOptionBox routeName="listQuestions" iconName="question-circle"  title="Questões"/>
          </b-card-group>
        </b-col>
        <b-col cols="3"></b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script>
import HeaderPage from "@/components/HeaderPage.vue";
import AdminOptionBox from "@/components/AdminOptionBox.vue";

export default {
  components: {
    HeaderPage,
    AdminOptionBox
  }
};
</script>