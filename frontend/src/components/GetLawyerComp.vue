<template>
  <div id="getLawyer">
    <!-- DATOS DEL ABOGADO SELECCIONADO -->
    <img
      :class="{ hide: dataLawyer.picture !== null }"
      src="../assets/profile.jpeg"
      alt="Foto de perfil por defecto"
    />
    <img
      :class="{ hide: dataLawyer.picture === null }"
      :src="getPictureLawyers(dataLawyer.picture)"
      alt="Foto del abogado"
    />
    <h2>{{ dataLawyer.lawFirm }}</h2>
    <p>
      <span>Dirección:</span>
      {{ dataLawyer.street }} {{ dataLawyer.zip }}
    </p>
    <p>
      <span>Localidad:</span>
      {{ dataLawyer.city }}
    </p>
    <p :class="{ hide: dataLawyer.phoneNumber === null }">
      <span>Teléfono:</span>
      {{ dataLawyer.phoneNumber }}
    </p>
    <p>
      <span>Email:</span>
      {{ dataLawyer.email }}
    </p>
    <ul :class="{ hide: specialities.length === 0 }">
      <span>Especialidades:</span>
      <li v-for="speciality in specialities" :key="speciality.id">
        <p>{{ speciality.speciality }}</p>
      </li>
    </ul>
    <p>
      <span>Urgencia tratando los procesos:</span>
      {{ dataLawyer.urgency }}
    </p>
    <p v-show="dataLawyer.description !== null">
      <span>Descripción:</span>
      {{ dataLawyer.description }}
    </p>
    <p>
      <star-rating
        :rating="Number(dataLawyer.voteAverage)"
        :increment="0.1"
        :read-only="true"
        :fixed-points="1"
        :star-size="20"
        :inline="true"
        :glow="2"
      ></star-rating>
      <router-link
        id="link"
        :to="{ name: 'ListRating', params: { id: dataLawyer.id } }"
        >( {{ dataLawyer.totalRatings }} votos )</router-link
      >
    </p>
    <p>
      <span>Registrado desde:</span>
      {{ formatDate(dataLawyer.creationDate) }}
    </p>
    <p>
      <span>Última conexión:</span>
      Hace
      {{ formatDistanceDate(dataLawyer.updateDate) }}
    </p>
  </div>
</template>

<script>
// Importamos date-fns
import { format, formatDistanceToNow } from "date-fns";
import es from "date-fns/locale/es";

export default {
  name: "GetLawyerComp",
  props: {
    dataLawyer: Object,
    specialities: Array,
  },
  methods: {
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
img {
  border-radius: 50%;
  width: 100px;
}
div#getLawyer {
  border: 1px solid var(--dark);
  background-color: var(--bright);
  border-radius: 10px;
  margin: 0.5rem;
  padding: 1rem;
}
h2 {
  font-weight: bold;
  text-decoration: underline;
  margin-bottom: 1rem;
}
p {
  margin-top: 0.5rem;
  font-size: 0.8rem;
}
span {
  font-weight: bold;
  text-decoration: underline;
  /*   display: flex;
  justify-content: space-around; */
}
#link {
  color: goldenrod;
}
ul {
  margin: 1rem;
}

ul li {
  list-style: none;
  border: none;
}

ul li span {
  font-weight: bold;
  text-decoration: underline;
}

@media (min-width: 700px) {
  div#getLawyer {
    width: 70%;
    margin: 0 auto;
  }
  img {
    width: 130px;
  }
  h2 {
    font-size: 1.65rem;
  }
  p {
    font-size: 1rem;
  }
  span {
    margin-top: 0.65rem;
  }
}

@media (min-width: 1000px) {
  img {
    width: 200px;
  }
  h2 {
    font-size: 1.9rem;
  }
  p {
    font-size: 1.1rem;
  }
  div#getLawyer {
    display: grid;
    width: 50%;
    gap: 1.5rem;
    margin: 1% auto;
    justify-items: center;
    align-items: center;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    grid-template-areas:
      "picture   picture  "
      "rating rating"
      "lawfirm    lawfirm"
      "adress    city"
      "phonenumber    email"
      "specialities    specialities"
      "urgency    urgency"
      "description description"
      "creation update";
  }

  img {
    grid-area: picture;
  }
  h2 {
    grid-area: lawfirm;
  }
  :nth-child(4) {
    grid-area: adress;
  }
  :nth-child(5) {
    grid-area: city;
  }
  :nth-child(6) {
    grid-area: phonenumber;
  }
  :nth-child(7) {
    grid-area: email;
  }
  ul {
    grid-area: specialities;
  }
  :nth-child(9) {
    grid-area: urgency;
  }
  :nth-child(10) {
    grid-area: description;
  }
  :nth-child(11) {
    grid-area: rating;
  }
  :nth-child(12) {
    grid-area: creation;
  }
  :nth-child(13) {
    grid-area: update;
  }
}
</style>
