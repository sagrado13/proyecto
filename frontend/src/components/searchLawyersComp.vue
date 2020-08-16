<template>
  <div>
    <ul>
      <li v-for="searchLawyer in searchLawyers" :key="searchLawyer.id">
        <router-link class="link" :to="{ name: 'GetLawyer', params: { id: searchLawyer.id } }">
          <img
            :class="{ hide: searchLawyer.picture_lawyer !== null }"
            src="../assets/profile.jpeg"
            alt="Foto de perfil por defecto"
          />
          <img
            :class="{ hide: searchLawyer.picture_lawyer === null }"
            :src="getPictureLawyers(searchLawyer.picture_lawyer)"
            alt="Foto abogado"
          />
          <p>
            <span>Abogado:</span>
            {{ searchLawyer.law_firm }}
          </p>
          <p>
            <span>Ciudad:</span>
            {{ searchLawyer.city_lawyer }}
          </p>
          <p :class="{ hide: searchLawyer.description === null }">
            <span>Descripción:</span>
            {{ searchLawyer.description }}
          </p>
          <p>
            <star-rating
              :rating="Number(searchLawyer.voteAverage)"
              :increment="0.1"
              :read-only="true"
              :fixed-points="1"
              :star-size="20"
              :inline="true"
              :glow="2"
            ></star-rating>
            <router-link
              class="link"
              :to="{ name: 'ListRating', params: { id: searchLawyer.id } }"
            >( {{ searchLawyer.total_ratings }} )</router-link>
          </p>
          <p>
            <span>Registrado desde:</span>
            {{ format(new Date(searchLawyer.creation_date), "dd/MM/yyyy") }}
          </p>
          <p>
            <span>Última conexión:</span>
            {{
            format(new Date(searchLawyer.update_date), "dd/MM/yyyy HH:mm")
            }}h
          </p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
// Importamos date-fns
import { format } from "date-fns";
export default {
  name: "searchLawyersComp",
  props: {
    searchLawyers: Array,
  },
  data() {
    return {
      format,
    };
  },
  methods: {
    getPictureLawyers(picture) {
      if (picture !== null) {
        return process.env.VUE_APP_STATIC_LAWYERS + picture;
      }
    },
  },
};
</script>

<style scoped>
.link {
  text-decoration: none;
  color: goldenrod;
}
.link:visited {
  color: goldenrod;
}
ul {
  margin-bottom: 2rem;
}
img {
  border-radius: 50%;
  width: 80px;
}
ul li {
  list-style: none;
  margin: 1rem;
  padding: 1rem;
  border: 1px solid white;
}
ul li p {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: white;
}
ul li p span {
  font-weight: bold;
  text-decoration: underline;
  display: flex;
  justify-content: space-around;
}

@media (min-width: 700px) {
  @media (min-width: 700px) {
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    ul li {
      max-width: 190px;
      height: auto;
    }
    ul li p {
      margin-top: 0.6rem;
      font-size: 0.9rem;
    }
  }
}

@media (min-width: 1000px) {
  img {
    width: 50%;
  }
}
</style>
