<template>
  <div>
    <!-- NOMBRE DEL ABOGADO, LOCALIDAD, MEDIA DE LAS PUNTUACIONES Y TOTAL DE VOTOS RECIBIDOS -->
    <div id="header">
      <router-link id="link" :to="{ name: 'GetLawyer' }">
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
          <span>Localidad:</span>
          {{ lawyer.city_lawyer }}
        </p>
      </router-link>
      <p id="rating">
        <star-rating
          :rating="Number(lawyer.voteAverage)"
          :increment="0.1"
          :read-only="true"
          :fixed-points="1"
          :star-size="25"
          :inline="true"
          :glow="2"
        ></star-rating>
        ( {{ lawyer.total_ratings }} votos )
      </p>
    </div>

    <!-- ORDENACIÓN -->
    <div id="order" @click="orderList()">
      <legend>Ordenar</legend>
      <select v-model="order" name="order">
        <option value>Fecha</option>
        <option value="rating">Puntuación</option>
      </select>
      <select v-model="direction" name="direction">
        <option value>Ascendente</option>
        <option value="desc">Descendente</option>
      </select>
    </div>

    <!-- LISTADO DE LAS PUNTUACIONES DEL ABOGADO SELECCIONADO -->
    <ul>
      <li v-for="rating in ratings" :key="rating.id">
        <p>
          <span>Usuario:</span>
          {{ rating.login_user }}
        </p>
        <p>
          <star-rating
            :rating="Number(rating.rating)"
            :read-only="true"
            :star-size="20"
            :inline="true"
            :glow="2"
          ></star-rating>
        </p>
        <p :class="{ hide: rating.opinion === null }">
          <span>Opinión:</span>
          {{ rating.opinion }}
        </p>
        <p>{{ formatDate(rating.update_date) }}h</p>
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
      order: "",
      direction: "",
    };
  },
  methods: {
    //FUNCIÓN PARA SACAR IMAGEN
    getPictureLawyers(picture) {
      if (picture !== null && picture !== undefined) {
        return process.env.VUE_APP_STATIC_LAWYERS + picture;
      }
    },
    //FUNCIÓN PARA FORMATEAR FECHA
    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy HH:mm");
    },
    orderList() {
      let params = {
        order: this.order,
        direction: this.direction,
      };
      this.$emit("data", params);
    },
    sendSpecialityId(index) {
      let idSpeciality = this.specialities[index].id;
      this.$emit("delete", idSpeciality);
    },
  },
};
</script>

<style scoped>
div#header {
  margin: 1rem;
}
p#rating {
  margin-top: 1rem;
}
span {
  font-weight: bold;
}
img {
  margin-top: 1rem;
  border-radius: 50%;
  width: 30%;
}

div#order legend {
  margin-top: 0.3rem;
}
div#order select {
  outline: none;
  background-color: var(--bright);
  color: var(--dark);
}
ul {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
ul li {
  list-style: none;
  border: 1px solid var(--dark);
  background-color: var(--bright);
  border-radius: 10px;
  margin: 0.1rem;
  padding: 0.3rem;
}
ul li p {
  margin: 0.3rem;
  font-size: 0.8rem;
}
#link {
  color: var(--dark);
  font-size: 0.9rem;
}

@media (min-width: 700px) {
  img {
    width: 20%;
  }
  h2 {
    font-size: 1.5rem;
  }
  div#order select {
    font-size: 0.9rem;
    padding: 0.1rem;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  ul li {
    width: 45%;
  }
  ul li p {
    font-size: 0.9rem;
  }
}

@media (min-width: 1000px) {
  div#header p {
    font-size: 1.1rem;
  }
  img {
    width: 10%;
  }
  div#order select {
    font-size: 1rem;
    padding: 0.2rem;
  }
  ul li {
    width: 23%;
  }
  ul li p {
    font-size: 1rem;
  }
}
</style>
