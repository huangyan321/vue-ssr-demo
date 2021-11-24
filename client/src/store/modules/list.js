const state = {
  num: 0
}
const mutations = {
  ADD (state) {
    state.num ++
    console.log(state.num);
  }
}
const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
