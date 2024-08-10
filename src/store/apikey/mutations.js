export function setApikey(state, val) {
  state.apikey = val;
  localStorage.setItem("apikey", val);
}
