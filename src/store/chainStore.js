const chainStore = {
  state: {
    chain: ""
  },
  mutations: {
    CHAIN_INFO(state, info) {
      state.chain = info;
    }
  },
  actions: {
    saveChainInfo({ commit }, data) {
      commit("CHAIN_INFO", data);
    }
  }
};
export default chainStore;
