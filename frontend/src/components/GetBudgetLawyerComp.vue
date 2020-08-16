<template>
  <div>
    <p>
      <span>Detalles del proceso nº {{ budget.id_process }}:</span>
      {{ budget.message_process }}
    </p>
    <p>
      <span>Cliente:</span>
      {{ budget.name }} {{ budget.surname }}
    </p>
    <p>
      <span>Teléfono:</span>
      {{ budget.phone_number_user }}
    </p>
    <p>
      <span>Email:</span>
      {{ budget.email_user }}
    </p>
    <p>
      <span>Estado:</span>
      {{ budget.status_budget }}
    </p>
    <p>
      <span>Mensaje:</span>
      {{ budget.message_budget }}
    </p>
    <p>
      <span>Precio:</span>
      {{ budget.price }}€
    </p>
    <p :class="{ hide: budget.rating === null }">
      <star-rating :rating="Number(budget.rating)" :read-only="true" :star-size="20" :inline="true"></star-rating>
    </p>
    <p :class="{ hide: budget.opinion === null }">
      <span>Opinión:</span>
      {{ budget.opinion }}
    </p>
    <p>
      <span>Fecha de creación:</span>
      {{ format(new Date(budget.creation_date), "dd/MM/yyyy HH:mm") }}h
    </p>
    <p>
      <span>Fecha de actualización:</span>
      {{ format(new Date(budget.update_date), "dd/MM/yyyy HH:mm") }}h
    </p>
  </div>
</template>

<script>
// Importamos date-fns
import { format } from "date-fns";
export default {
  name: "GetBudgetLawyerComp",
  props: {
    budget: Object,
  },
  data() {
    return {
      format,
    };
  },
};
</script>

<style scoped>
span {
  font-weight: bold;
  text-decoration: underline;
  display: flex;
  flex-direction: column;
}
p {
  margin-top: 0.5rem;
}

@media (min-width: 700px) {
  span {
    display: inline-block;
  }
  p {
    margin-top: 0.7rem;
  }
}
</style>