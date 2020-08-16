<template>
  <div>
    <h3>Últimos abogados conectados</h3>
    <ul>
      <li v-for="lawyer in lawyers" :key="lawyer.id">
        <router-link class="link" :to="{ name: 'GetLawyer', params: { id: lawyer.id } }">
          <img
            :class="{ hide: lawyer.picture_lawyer !== null }"
            src="../assets/profile.jpeg"
            alt="Foto de perfil por defecto"
          />
          <img
            :class="{ hide: lawyer.picture_lawyer === null }"
            :src="getPictureLawyers(lawyer.picture_lawyer)"
            alt="Foto de abogado"
          />
          <p>
            <span>Nombre:</span>
            {{ lawyer.law_firm }}
          </p>
          <p>
            <span>Ciudad:</span>
            {{ lawyer.city_lawyer }}
          </p>
          <p :class="{ hide: lawyer.description === null }">
            <span>Descripción:</span>
            {{ lawyer.description }}
          </p>
          <p id="rating">
            <star-rating
              :rating="Number(lawyer.voteAverage)"
              :increment="0.1"
              :read-only="true"
              :fixed-points="1"
              :star-size="20"
              :inline="true"
              :glow="2"
            ></star-rating>
            ( {{ lawyer.total_ratings }} )
          </p>
          <p>
            <span>Registrado desde:</span>
            {{ format(new Date(lawyer.creation_date), "dd/MM/yyyy") }}
          </p>
          <p>
            <span>Última conexión:</span>
            {{ format(new Date(lawyer.update_date), "dd/MM/yyyy HH:mm") }}h
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
  name: "ListLawyers",
  props: {
    lawyers: Array,
  },
  data() {
    return {
      format,
    };
  },
  methods: {
    // FUNCIÓN PARA OBTENER FOTO DE ABOGADO
    getPictureLawyers(picture) {
      if (picture !== null) {
        return process.env.VUE_APP_STATIC_LAWYERS + picture;
      }
    },
  },
};
</script>

<style scoped>
img {
  border-radius: 50%;
  width: 80px;
}
ul {
  margin-bottom: 2rem;
}
ul li {
  list-style: none;
  margin: 1rem;
  padding: 1rem;
  border: 1px solid white;
  /* border-radius: 50px; */
}
ul li p {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: white;
}
ul li p span {
  font-weight: bold;
  text-decoration: underline;
  display: block;
}

.link {
  text-decoration: none;
  color: black;
}
.link:visited {
  color: black;
}

@media (min-width: 700px) {
  h3 {
    font-size: 1.25rem;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  ul li {
    max-width: 190px;
  }
  ul li p {
    margin-top: 0.6rem;
    font-size: 0.9rem;
  }
}

@media (min-width: 1000px) {
  img {
    width: 50%;
  }
  h3 {
    font-size: 1.5rem;
  }
}
</style>
