<template>
  <div>
    <h3>Los abogados mejor valorados</h3>

    <!-- SLIDE DE LOS 5 MEJORES ABOGADOS -->
    <hooper :infiniteScroll="true" :autoPlay="true" :itemsToShow="2">
      <slide
        v-for="topLawyer in topLawyers"
        :key="topLawyer.id"
        style="padding: 1rem"
      >
        <router-link
          class="link"
          :to="{ name: 'GetLawyer', params: { id: topLawyer.id } }"
        >
          <img
            :class="{ hide: topLawyer.picture_lawyer !== null }"
            src="../assets/profile.jpeg"
            alt="Foto de perfil por defecto"
          />
          <img
            :class="{ hide: topLawyer.picture_lawyer === null }"
            :src="getPictureLawyers(topLawyer.picture_lawyer)"
            alt="Foto abogado"
          />
          <p>
            <span>Abogado:</span>
            {{ topLawyer.law_firm }}
          </p>
          <p>
            <span>Localidad:</span>
            🌍 {{ topLawyer.city_lawyer }}
          </p>
        </router-link>
      </slide>
    </hooper>
  </div>
</template>

<script>
// Impotamos hooper
import { Hooper, Slide } from "hooper";
import "hooper/dist/hooper.css";
export default {
  name: "Top10LawyersComp",
  components: {
    Hooper,
    Slide,
  },
  props: {
    topLawyers: Array,
  },
  methods: {
    // FUNCIÓN PARA SACAR LA FOTO
    getPictureLawyers(picture) {
      if (picture !== null) {
        return process.env.VUE_APP_STATIC_LAWYERS + picture;
      }
    },
  },
};
</script>

<style scoped>
h3 {
  text-decoration: underline;
  padding-bottom: 0.5rem;
  font-size: 1rem;
}
.hooper {
  width: 270px;
  height: 170px;
  margin: 0 auto;
  outline: none;
  background-color: goldenrod;
  border-radius: 10px;
  margin-bottom: 1rem;
}
li.hooper-slide img {
  border-radius: 50%;
  width: 30%;
}

li.hooper-slide {
  border-radius: 10px;
  width: 100%;
  background-color: goldenrod;
  box-shadow: 1px 1px 15px white;
}
li.hooper-slide a.link {
  text-decoration: none;
  color: var(--dark);
}
li.hooper-slide p {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: black;
}
li.hooper-slide p span {
  font-weight: bold;
  text-decoration: underline;
  display: flex;
  justify-content: space-around;
}

@media (min-width: 700px) {
  h3 {
    padding-bottom: 0.7rem;
    font-size: 1.25rem;
  }
  section.hooper {
    width: 290px;
    min-height: 200px;
  }
  li.hooper-slide img {
    width: 40%;
  }
  li.hooper-slide p {
    margin-top: 0.6rem;
    font-size: 0.9rem;
  }
}

@media (min-width: 1000px) {
  h3 {
    padding-bottom: 1rem;
    font-size: 1.5rem;
  }
  section.hooper {
    width: 330px;
    min-height: 230px;
  }
  li.hooper-slide img {
    width: 50%;
  }
  li.hooper-slide p {
    font-size: 1rem;
  }
}
</style>
