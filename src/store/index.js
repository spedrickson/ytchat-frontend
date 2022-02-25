import { createStore } from "vuex";
import apikey from "./apikey";
import createPersistedState from "vuex-persistedstate";

export default function (/* { ssrContext } */) {
  return createStore({
    modules: {
      apikey,
    },
    plugins: [createPersistedState({ storage: window.sessionStorage })],

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  });
}
