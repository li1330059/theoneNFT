 <template>
  <div class="t-wrap">
    <loading v-if="is_loading" style="margin-top:20vh" />
    <empty v-else-if="is_empty" />
    <div v-else class="content">
      <slot></slot>
    </div>
  </div>
</template>
    
<script>
import loading from "@/components/v1/loading/loading";
import empty from "@/components/v1/empty";
export default {
  name: "pageTemplate",
  components: { loading, empty },
  data() {
    return {
      is_loading: false,
    };
  },
  props: {
    is_empty: {
      type:Boolean,
      default: false,
    },
    
  },

  methods: {
    showLoading() {
      this.is_loading = true;
    },
    hideLoading() {
      this.is_loading = false;
    },
  },
};
</script> 
  
<style lang="scss" scoped>
.t-wrap {
  .content {
    width: 100%;
  }
}
</style>