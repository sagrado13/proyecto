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
</style>