<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="w-100 d-flex justify-content-center">
    <div class="text-left w-75 pt-auto mr-auto">
      <h5 class="pt-3 source-sans-pro font-weight-500" v-if="total !== 0">Menampilkan {{ startOffset() }} ke {{ endOffset() }} dari {{ total }} entri data - Halaman {{ value }}</h5>
      <h5 class="pt-3 source-sans-pro font-weight-500" v-else>Tidak ada data yang dapat ditampilkan</h5>
  </div>
    <b-pagination first-number last-number :per-page="perPage" :size="size" :value="value" @change="(val) => $emit('change', val)" :align="align" :total-rows="total">

      <template v-slot:prev-text>
        <a class="page-link" aria-label="Previous">
          <span aria-hidden="true">
            <font-awesome-icon icon="angle-left"></font-awesome-icon>
          </span>
        </a>
      </template>

      <template v-slot:next-text>
        <a class="page-link" aria-label="Next">
          <span aria-hidden="true">
            <font-awesome-icon icon="angle-right"></font-awesome-icon>
          </span>
        </a>
      </template>

    </b-pagination>
  </div>
</template>
<script>
  export default {
    name: "base-pagination",
    props: {
      pageCount: {
        type: Number,
        default: 0,
        description: "Pagination page count. This should be specified in combination with perPage"
      },
      perPage: {
        type: Number,
        default: 10,
        description: "Pagination per page. Should be specified with total or pageCount"
      },
      total: {
        type: Number,
        default: 0,
        description: "Can be specified instead of pageCount. The page count in this case will be total/perPage"
      },
      value: {
        type: Number,
        default: 1,
        description: "Pagination value"
      },
      size: {
        type: String,
        default: "",
        description: "Pagination size"
      },
      align: {
        type: String,
        default: "",
        description: "Pagination alignment (e.g center|start|end)"
      }
    },
    data(){
      return {
        startOffset() {
          return ((this.perPage * this.value) - this.perPage) + 1;
        },
        endOffset() {
          const offsetEnd = (this.startOffset() +this.perPage) -1;
          return offsetEnd < this.total ? offsetEnd : this.total;
        }
      }
    },
    methods:{}
  };
</script>