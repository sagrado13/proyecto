import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import { isLoggedInUser } from "../api/utils.js";
import { isLoggedInLawyer } from "../api/utils.js";
import { checkIsAdmin } from "../api/utils.js";

Vue.use(VueRouter);

const routes = [
  // HOME
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      allowAnon: true,
    },
  },
  // ABOUT
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // ERROR
  {
    path: "*",
    name: "Error",
    component: () => import("../views/Error.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // RUTAS DE ADMIN
  // Listado de usuarios dados de baja
  {
    path: "/list-deleted-users",
    name: "ListDeletedUsers",
    component: () => import("../views/ListDeletedUsers.vue"),
    meta: {
      allowAnon: false,
      onlyAdmin: true,
    },
    beforeEnter: (to, from, next) => {
      if (to.meta.onlyAdmin === true && checkIsAdmin()) {
        next({
          path: "/",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    },
  },
  // Listado de abogados dados de baja
  {
    path: "/list-deleted-lawyers",
    name: "ListDeletedLawyers",
    component: () => import("../views/ListDeletedLawyers.vue"),
    meta: {
      allowAnon: false,
      onlyAdmin: true,
    },
    beforeEnter: (to, from, next) => {
      if (to.meta.onlyAdmin === true && checkIsAdmin()) {
        next({
          path: "/",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    },
  },
  // RUTAS DE USUARIO
  // Nuevo usuario
  {
    path: "/new-user",
    name: "NewUser",
    component: () => import("../views/NewUser.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // Validación de cuenta de usuario
  {
    path: "/users/validation/:registrationCode",
    name: "ValidationUser",
    component: () => import("../views/ValidationUser.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // Resetear contraseña de usuario
  {
    path: "/users/reset-password/:recoverCode",
    name: "ResetPasswordUser",
    component: () => import("../views/ResetPasswordUser.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // Ver Perfil de usuario, editarlo y borrarlo
  {
    path: "/profile-user",
    name: "GetUser",
    component: () => import("../views/GetUser.vue"),
    meta: {
      allowAnon: false,
    },
  },
  // Abrir proceso nuevo
  {
    path: "/new-process/:id",
    name: "NewProcess",
    component: () => import("../views/NewProcess.vue"),
    meta: {
      allowAnon: false,
    },
    beforeEnter: (to, from, next) => {
      if (isLoggedInLawyer()) {
        next({
          path: "/new-user",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    },
  },
  // Ver processos de usuario
  {
    path: "/processes-user",
    name: "ListProcessesUser",
    component: () => import("../views/ListProcessesUser.vue"),
    meta: {
      allowAnon: false,
    },
  },
  // Ver un presupuesto determinado
  {
    path: "/budget-user/:id",
    name: "GetBudgetUser",
    component: () => import("../views/GetBudgetUser.vue"),
    meta: {
      allowAnon: false,
    },
  },
  // Ver un abogado determinado
  {
    path: "/lawyer/:id",
    name: "GetLawyer",
    component: () => import("../views/GetLawyer.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // Ver listado de puntuaciones de un abogado
  {
    path: "/lawyers/:id/ratings",
    name: "ListRating",
    component: () => import("../views/ListRating.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // RUTAS DE ABOGADO
  // Nuevo abogado
  {
    path: "/new-lawyer",
    name: "NewLawyer",
    component: () => import("../views/NewLawyer.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // Validación de cuenta de abogado
  {
    path: "/lawyers/validation/:registrationCode",
    name: "ValidationLawyer",
    component: () => import("../views/ValidationLawyer.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // Resetear contraseña de abogado
  {
    path: "/lawyers/reset-password/:recoverCode",
    name: "ResetPasswordLawyer",
    component: () => import("../views/ResetPasswordLawyer.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // Editar abogado
  {
    path: "/profile-lawyer",
    name: "EditLawyer",
    component: () => import("../views/EditLawyer.vue"),
    meta: {
      allowAnon: false,
    },
  },
  // Ver processos de abogado
  {
    path: "/processes-lawyer",
    name: "ListProcessesLawyer",
    component: () => import("../views/ListProcessesLawyer.vue"),
    meta: {
      allowAnon: false,
    },
  },
  // Ver un presupuesto determinado
  {
    path: "/budget-lawyer/:id",
    name: "GetBudgetLawyer",
    component: () => import("../views/GetBudgetLawyer.vue"),
    meta: {
      allowAnon: false,
    },
  },
  // Ver un presupuesto determinado
  {
    path: "/new-budget/:id",
    name: "NewBudget",
    component: () => import("../views/NewBudget.vue"),
    meta: {
      allowAnon: false,
    },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.meta.allowAnon && !isLoggedInUser() && !isLoggedInLawyer()) {
    next({
      path: "/new-user",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
