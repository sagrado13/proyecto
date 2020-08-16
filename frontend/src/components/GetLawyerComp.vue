<template>
  <div id="getLawyer">
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
      <span>Ciudad:</span>
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

    <p :class="{ hide: dataLawyer.description === null }">
      <span>Descripción:</span>
      {{ dataLawyer.description }}
    </p>
    <p :class="{ hide: dataLawyer.totalRatings === 0 }">
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
      >( {{ dataLawyer.totalRatings }} votos )</router-link>
    </p>
    <p>
      <span>Registrado desde:</span>
      {{ format(new Date(dataLawyer.creationDate), "dd/MM/yyyy") }}
    </p>
    <p>
      <span>Última conexión:</span>
      {{ format(new Date(dataLawyer.updateDate), "dd/MM/yyyy HH:mm") }}h
    </p>
  </div>
</template>

<script>
// Importamos date-fns
import { format } from "date-fns";
export default {
  name: "GetLawyerComp",
  props: {
    dataLawyer: Object,
    specialities: Array,
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
img {
  border-radius: 50%;
  width: 35%;
}
div#getLawyer {
  border: 1px solid white;
  margin: 1rem;
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
}

ul li span {
  font-weight: bold;
  text-decoration: underline;
}

@media (min-width: 700px) {
  img {
    width: 20%;
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
    width: 20%;
  }
  h2 {
    font-size: 1.9rem;
  }
  p {
    font-size: 1.1rem;
  }
  div#getLawyer {
    display: grid;
    gap: 0.5rem;
    margin: 0.5rem;
    justify-items: center;
    align-items: center;
    grid-template-columns: auto auto auto auto;
    grid-template-rows: auto auto auto auto;
    grid-template-areas:
      "picture   adress    city    phonenumber"
      "lawfirm    email     urgency     description"
      "rating specilaities  creation  update ";
  }

  img {
    width: 30%;
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
  ul li {
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
