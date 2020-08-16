<template>
  <div>
    <ul>
      <span>Especialidades:</span>
      <li v-for="(speciality, index) in specialities" :key="speciality.id">
        <p>
          {{speciality.speciality}}
          <button @click="sendSpecialityId(index)">❌</button>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "EditLawyerComp",
  props: {
    specialities: Array,
  },
  methods: {
    sendSpecialityId(index) {
      let idSpeciality = this.specialities[index].id;
      console.log(idSpeciality);
      this.$emit("delete", idSpeciality);
    },
  },
};
</script>

<style scoped>
ul {
  margin-top: 0.5rem;
}
span {
  text-decoration: underline;
  font-weight: bold;
}
ul li {
  list-style: none;
  margin: 0.3rem;
}
button {
  outline: none;
  all: unset;
  font-size: 0.7rem;
  margin-left: 0.5rem;
}

@media (min-width: 700px) {
  ul {
    margin-top: 1.5rem;
  }
  span {
    font-size: 1.25rem;
  }
  p {
    font-size: 1rem;
    margin: 0.6rem;
  }
}

@media (min-width: 1000px) {
  ul {
    margin-top: 2rem;
  }
  p {
    margin: 0.8rem;
  }
}
</style>