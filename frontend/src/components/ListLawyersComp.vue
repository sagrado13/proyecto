<template>
  <div id="list">
    <h3>Últimos abogados conectados</h3>

    <!-- DATOS DE LOS ÚLTIMOS ABOGADOS QUE ESTUVIERON CONECTADOS -->
    <ul>
      <li v-for="lawyer in lawyers" :key="lawyer.id">
        <!-- ENLACE PARA VER TODOS LOS DATOS DEL ABOGADO SELECCIONADO -->
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
            <span>Localidad:</span>
            🌍 {{ lawyer.city_lawyer }}
          </p>
          <p v-if="lawyer.description !== null && lawyer.description !== 'null'">
            <span>Descripción:</span>
            {{ lawyer.description }}
          </p>
          <p>
            <star-rating
              :rating="Number(lawyer.voteAverage)"
              :increment="0.1"
              :read-only="true"
              :fixed-points="1"
              :star-size="20"
              :inline="true"
              :glow="2"
            ></star-rating>
            <router-link
              class="link"
              :to="{ name: 'ListRating', params: { id: lawyer.id } }"
            >( {{ lawyer.total_ratings }} )</router-link>
          </p>
          <p>
            <span>Registrado desde:</span>
            {{ formatDate(lawyer.creation_date) }}
          </p>
          <p>
            <span>Última conexión:</span>
            Hace
            {{ formatDistanceDate(lawyer.update_date) }}
          </p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
// Importamos date-fns
import { format, formatDistanceToNow } from "date-fns";
import es from "date-fns/locale/es";

export default {
  name: "ListLawyers",
  props: {
    lawyers: Array,
  },
  methods: {
    // FUNCIÓN PARA OBTENER FOTO DE ABOGADO
    getPictureLawyers(picture) {
      if (picture !== null) {
        return process.env.VUE_APP_STATIC_LAWYERS + picture;
      }
    },
    //FUNCIÓN PARA FORMATEAR FECHA
    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy");
    },
    //FUNCIÓN PARA CALCULAR EL TIEMPO DESDE LA FECHA
    formatDistanceDate(date) {
      return formatDistanceToNow(new Date(date), {
        includeSeconds: true,
        locale: es,
      });
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
div#list {
  background-color: var(--background);
  padding: 1rem;
}
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
  border: 1px solid var(--dark);
  border-radius: 10px;
  background-color: var(--bright);
}
ul li p {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--dark);
}
ul li p span {
  font-weight: bold;
  text-decoration: underline;
  display: block;
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
    width: 160px;
  }
  ul li p {
    margin-top: 0.6rem;
    font-size: 0.9rem;
  }
}

@media (min-width: 1000px) {
  img {
    width: 100px;
  }
  ul li {
    width: 190px;
    /*     height: 400px; */
  }
  h3 {
    font-size: 1.5rem;
  }
}
</style>
