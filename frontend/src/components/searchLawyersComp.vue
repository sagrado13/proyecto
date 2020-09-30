<template>
  <div>
    <!-- LISTADO DE ABOGADOS ENCONTRADOS EN LA BÚSQUEDA -->
    <ul>
      <li v-for="searchLawyer in showedLawyer" :key="searchLawyer.id">
        <!-- ENLACE A TODOS LOS DATOS DEL ABOGADO SELECCIONADO -->
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
            <span>Localidad:</span>
            🌍 {{ searchLawyer.city_lawyer }}
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
            {{ formatDate(searchLawyer.creation_date) }}
          </p>
          <p>
            <span>Última conexión:</span>
            Hace
            {{ formatDistanceDate(searchLawyer.update_date) }}
          </p>
        </router-link>
      </li>
    </ul>

    <!-- PAGINATION -->
    <nav>
      <ul>
        <li :class="{ disable: currentPage === 0 }">
          <button @click="previousPage">Anterior</button>
        </li>

        <li v-for="page in pages" :key="page" :class="{ active: currentPage === page }">
          <button @click="goToPage(page)">{{ page + 1 }}</button>
        </li>

        <li :class="{ disable: currentPage === pages.length - 1 }">
          <button @click="nextPage">Siguiente</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
// Importamos date-fns
import { format, formatDistanceToNow } from "date-fns";
import es from "date-fns/locale/es";

export default {
  name: "searchLawyersComp",
  props: {
    searchLawyers: Array,
  },
  data() {
    return {
      currentIndex: 0,
      elementsPerPage: 14,
      currentPage: 0,
    };
  },
  computed: {
    // FUNCÍÓN PARA MOSTRAR UN NÚMERO DETERMINADO POR PÁGINA
    showedLawyer() {
      return this.searchLawyers.slice(
        this.currentIndex,
        this.currentIndex + this.elementsPerPage
      );
    },
    // FUNCIÓN PARA CALCULAR EL NÚMERO DE PÁGINAS QUE HAY SEGÚN EL NÚMERO TOTAL DEL RESULTADO DE LA BÚSQUEDA
    // Y LOS QUE SE VAN MOSTRAR POR PÁGINA
    pages() {
      let numberOfPages = Math.ceil(
        this.searchLawyers.length / this.elementsPerPage
      );
      let pageArray = [];
      for (let i = 0; i < numberOfPages; i++) {
        pageArray.push(i);
      }
      return pageArray;
    },
  },
  methods: {
    // FUNCIÓN PARA IR A LA PÁGINA ANTERIOR
    previousPage() {
      this.currentPage = this.currentPage - 1;
      this.currentIndex = this.currentIndex - this.elementsPerPage;
      window.scrollTo(0, 700);
    },
    // FUNCIÓN PARA IR A LA PÁGINA SIGUIENTE
    nextPage() {
      this.currentPage = this.currentPage + 1;
      this.currentIndex = this.currentIndex + this.elementsPerPage;
      window.scrollTo(0, 700);
    },
    // FUNCIÓN PARA IR A LA PÁGINA SELECCIONADA
    goToPage(page) {
      this.currentPage = page;
      this.currentIndex = page * this.elementsPerPage;
      window.scrollTo(0, 700);
    },
    // FUNCIÓN PARA SACAR IMAGEN
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
ul {
  background-color: var(--background);
  padding: 1rem;
}
img {
  border-radius: 50%;
  width: 80px;
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
  display: flex;
  justify-content: space-around;
}
nav ul li {
  display: inline;
}
nav ul li {
  margin: 0.3rem;
  padding: 0;
  border: 0;
  width: auto;
}
nav ul li button {
  outline: 0;
  box-shadow: 5px 5px 30px var(--button) inset;
  border-radius: 10px;
}
nav ul li.disable {
  pointer-events: none;
}
nav ul li.disable button {
  color: var(--gray);
}
nav ul li.active button {
  box-shadow: 5px 5px 30px yellowgreen inset;
}

@media (min-width: 700px) {
  @media (min-width: 700px) {
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    ul li {
      width: 190px;
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
