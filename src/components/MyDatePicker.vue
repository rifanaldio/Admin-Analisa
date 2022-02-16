<template>
  <div>
    <datepicker
      v-bind="$attrs"
      :placeholder="placeholder"
      :language="language"
      :format="dateFormat"
      v-model="value"
      :input-class="bsClass"
    ></datepicker>
  </div>
</template>

<!--<div class="input-group">
  <input type="text" placeholder="Select your date of birth" clear-button="true" autocomplete="off" class="text-left mb-4 form-control">
  <div class="vdp-datepicker__clear-button input-group-append pb-auto mb-auto">
    <span class="btn btn-default bg-white text-black-50 source-sans-pro"><span>clear</span></span>
  </div>
</div>-->

<script>
import Datepicker from "vuejs-datepicker/dist/vuejs-datepicker.esm.js";
import { id as langId } from "vuejs-datepicker/src/locale";

export default {
  name: "MyDatePicker",
  // inheritAttrs: false,
  components: {
    Datepicker,
  },
  props: {
    /**
     * Untuk format lanjutan dapat dilihat pada link {@link  https://bootstrap-vue.org/docs/components/calendar}
     */
    dateFormat: {
      // type: Function,
      type: String,
      default: "dd-MM-yyyy",
      description:
        "Untuk format lanjutan dapat dilihat pada link https://www.npmjs.com/package/vuejs-datepicker",
    },

    placeholder: {
      type: String,
      default: "No date selected",
    },

    bsClass: {
      type: [String, Object],
      default: "form-control bg-white",
    },

    language: {
      type: Object,
      default: () => langId,
    },
  },

  // untuk di ekspor menjadi v-model
  model: {
    prop: "selected-date",
    event: "change",
  },

  data() {
    return {
      value: "",
      guid: this.myGuid("_my_datepicker_"),
    };
  },

  watch: {
    value(val) {
      this.$emit("change", val);
    },
  },
};
</script>
