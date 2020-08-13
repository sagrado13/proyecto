<template>
  <div>
    <div id="header">
      <router-link id="link" :to="{ name: 'GetLawyer'}">
        <img
          :class="{ hide: lawyer.picture_lawyer !== null }"
          src="../assets/profile.jpeg"
          alt="Foto de perfil por defecto"
        />
        <img
          :class="{ hide: lawyer.picture_lawyer === null }"
          :src="getPictureLawyers(lawyer.picture_lawyer)"
          alt="Foto del abogado"
        />
        <h2>{{ lawyer.law_firm }}</h2>
        <p>
          <span>Ciudad:</span>
          {{ lawyer.city_lawyer }}
        </p>
      </router-link>
    </div>
    <ul>
      <li v-for="rating in ratings" :key="rating.id">
        <p>
          <span>Usuario:</span>
          {{ rating.login_user }}
        </p>
        <p>
          <star-rating
            :rating="Number(rating.rating)"
            :increment="0.1"
            :read-only="true"
            :fixed-points="1"
            :star-size="20"
            :inline="true"
            :glow="2"
          >( {{ rating.total_ratings }} )</star-rating>
        </p>
        <p :class="{ hide: rating.opinion === null }">
          <span>Opinión:</span>
          {{ rating.opinion }}
        </p>
        <p>{{ format(new Date(rating.update_date), "dd/MM/yyyy HH:mm") }}h</p>
      </li>
    </ul>
  </div>
</template>

<script>
// Importamos date-fns
import { format } from "date-fns";
export default {
  name: "ListRatingsComp",
  props: {
    lawyer: Object,
    ratings: Array,
  },
  data() {
    return {
      format,
    };
  },
  methods: {
    getPictureLawyers(picture) {
      if (picture !== null && picture !== undefined) {
        return process.env.VUE_APP_STATIC_LAWYERS + picture;
      }
    },
  },
};
</script>

<style scoped>
div#header {
  margin: 1rem;
}
img {
  margin-top: 1rem;
  border-radius: 50%;
  width: 30%;
}
ul {
  margin-top: 2rem;
  margin-bottom: 1rem;
}
ul li {
  list-style: none;
  border: 1px solid white;
  margin: 0.5rem;
  padding: 0.3rem;
}
ul li p {
  margin: 0.3rem;
}
#link {
  color: goldenrod;
  font-size: 0.9rem;
}
</style>
