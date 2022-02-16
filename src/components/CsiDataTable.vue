<template>
    <div>
        <b-card-header class="border-0">
            <b-row>
                <b-col cols="4">
                    <slot name="table-action">
                        <!--Disini akan di isikan tombol custom dari user, seperti tombol add, dll.-->
                    </slot>
                </b-col>

                <!--Form Pencarian Table-->
                <b-col cols="8" class="text-right">
                    <div class="d-inline-flex align-content-center w-100 mr-auto">
                        <!--<b-form class="ml-auto align-self-end" :class="this.enSearch !== true ?'w-50' : 'w-100'" v-on:submit.prevent="(evt)=> handleTableSearch(evt)">-->
                        <b-form
                                class="ml-auto align-self-end"
                                :class="this.enSearch !== true ? 'w-50' : 'w-100'"
                                v-on:submit.prevent="(evt) => handleTableSearch(evt)"
                        >
                            <!--Input Filter Tanggal-->
                            <b-input-group
                                    :class="{ 'w-50 float-left': this.enSearch === true }"
                                    v-if="this.enDateFilter === true"
                            >
                                <my-date-picker
                                        v-model="dateRange.date_start"
                                        style="width: 40%"
                                        class="text-left ml-auto"
                                        @change="rangeChanged"
                                ></my-date-picker>
                                <b-input-group-append>
                  <span
                          class="pl-2 pr-2 text-center font-weight-400 pt-2"
                          style="background-color: #0000002e"
                  >S.D</span
                  >
                                </b-input-group-append>
                                <my-date-picker
                                        v-model="dateRange.date_end"
                                        style="width: 40%"
                                        class="text-left mr-2"
                                        @change="rangeChanged"
                                ></my-date-picker>
                            </b-input-group>

                            <!--Input Filter Pencarian-->
                            <b-input-group
                                    prepend="Search"
                                    title="Masukkan input pencarian"
                                    class="w-50 float-right"
                                    v-if="this.enSearch === true"
                            >
                                <!--<b-form-input class="w-auto text-left" name="tableFilter" v-model="search"></b-form-input>-->
                                <b-form-input
                                        class="text-left"
                                        name="tableFilter"
                                        v-model="search"
                                ></b-form-input>
                                <b-input-group-append>
                                    <b-button
                                            class="source-sans-pro text-center"
                                            type="submit"
                                            variant="info"
                                            title="proses pencarian"
                                            style="z-index: auto"
                                    >
                                        <font-awesome-icon icon="search"></font-awesome-icon>
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-form>

                        <!--Tombol Refresh Tabel-->
                        <div
                                class="ml-0"
                                :class="{
                'w-100': this.enSearch !== true && this.enDateFilter !== true,
              }"
                        >
                            <button
                                    type="button"
                                    class="btn source-sans-pro btn-primary border-0 ml-2"
                                    style="border-radius: 10%"
                                    @click="refreshTable"
                                    title="Muat ulang tabel"
                            >
                                <font-awesome-icon icon="sync-alt"></font-awesome-icon>
                            </button>
                        </div>
                    </div>
                </b-col>
            </b-row>
        </b-card-header>
        <table
                class="table table-bordered table-striped table-hover b-table table-responsive"
        >
            <thead>
            <tr>
                <template v-for="(column, index) in columns">
                    <!--untuk [sortable]-->
                    <th
                            :key="index"
                            v-if="column.sortable"
                            aria-sort="none"
                            :style="{
                width: !isNaN(column.width) ? `${column.width}%` : 'auto',
                'text-align': column.align || 'left',
              }"
                            role="columnheader"
                            @click="
                (ev) =>
                  onSortChange({ column: column, prop: column.key, ev: ev })
              "
                    >
                        <b>{{ column.label }}</b>
                    </th>
                    <!--untuk tanpa [sortable]-->
                    <th
                            :key="index"
                            v-else
                            :style="{
                width: !isNaN(column.width) ? `${column.width}%` : 'auto',
                'text-align': column.align || 'left',
              }"
                            role="columnheader"
                    >
                        <b>{{ column.label }}</b>
                    </th>
                </template>
            </tr>
            </thead>
            <tbody ref="csitable_tbody">
            <tr v-for="(row, index) in rows" :key="index">
                <!-- row -->
                <td
                        v-for="column in columns"
                        :key="column.key"
                        :style="{ 'text-align': column.align || 'left' }"
                >
                    <!-- slot (column.key) yang di custom (misalnya ditambahkan beberapa elemen) akan diletakkan disini -->
                    <!--                             v-if="scopedSlots[column.key]" -->
                    <slot
                            v-if="$slots[column.key]"
                            :name="column.key || column.label"
                            :row="row"
                    ></slot>
                    <!-- ini adalah default default slot jika slot (column.key) tidak di custom -->
                    <span v-else>{{ row[column.key] }}</span>
                </td>
            </tr>
            </tbody>
        </table>

        <!--Pagination-->
        <slot name="pagination">
            <b-card-footer class="py-4 d-flex justify-content-end">
                <base-pagination
                        v-model="page"
                        :per-page="limit"
                        :total="total"
                        :page-count="totalPage"
                        @change="setPage"
                ></base-pagination>
            </b-card-footer>
        </slot>
    </div>
</template>

<script type="text/babel">
  // import { Loading } from "element-ui";
  import BasePagination from "./BasePagination";
  import MyDatePicker from "./MyDatePicker";

  export default {
    name: "CsiDataTable",
    inheritAttrs: false,
    // inheritAttrs: false,
    components: {
      [BasePagination.name]: BasePagination,
      MyDatePicker
    },
    directives: {
      //loading: Loading,
    },
    props: {
      /**
       * Jumlah record maksimum yang akan ditampilkan pada tabel (default 10).
       */
      limit: {
        type: Number,
        default: 10,
        description: "Total data yang akan ditampilkan pada table (default 10)"
      },

      /**
       * Konfigurasi tabel jika ingin mengaktifkan fitur pencarian pada tabel.
       */
      enSearch: {
        type: Boolean,
        default: true,
        description:
          "Konfigurasi tabel jika ingin mengaktifkan fitur pencarian pada tabel."
      },

      /**
       * Konfigurasi tabel jika ingin mengaktifkan fitur filter tanggal
       */
      enDateFilter: {
        type: Boolean,
        default: false,
        description:
          "Konfigurasi tabel jika ingin mengaktifkan fitur filter tanggal"
      },

      /**
       * Kumpulan data yang akan ditampilkan pada tabel.
       */
      columns: {
        type: Array,
        default: () => [],
        description: "Isian kolom yang akan ditampilkan pada table"
      },

      /**
       *  Fungsi yang dipanggil guna pengambilan data untuk tabel.
       */
      getData: {
        type: Function,
        default: () => Promise.resolve([])
      },

      /**
       * Fungsi yang akan dipanggil saat tabel akan dimuat ulang.
       */
      beforeReload: {
        type: Function,
        default: null,
        description: "Fungsi yang akan dipanggil saat tabel akan dimuat ulang"
      },

      /**
       * Fungsi yang dipanggil setelah tabel selesai dengan proses yang diperlukan.
       */
      loadComplete: {
        type: Function,
        default: null,
        description:
          "Fungsi yang akan dipanggil saat tabel selesai memproses data"
      }
    },
    data() {
      return {
        page: 1,
        search: null,
        // total records row yang diterima.
        total: 0,

        // jumlah keseluruhan halaman yang dapat ditampilkan.
        totalPage: 0,

        loading: false,

        // versi dari ui-table untuk sortOrder
        sort: [],

        // versi sortOrder untuk diberikan pada pengguna
        // sebenarnya ini sama dengan @sort tetapi beda pada model nilai saja.
        orderBy: { column: null, dir: "asc" },

        // tempat untuk menyimpan sementara data sebelum teruskan ke tabel.
        rows: [],

        // jika fitur filter tanggal digunakan,
        // seharusnya setiap element pada objek ini akan terisi.
        dateRange: {
          date_start: null,
          date_end: null
        },

        // sebagai pengingat kolom-kolom data yang
        // digunakan sebagai inisialisasi pengurutan data.
        defaultOrderableElement: (function(x) {
          const orderable = x.find(
            (value) => typeof value.key === "string" && value.sortable === true
          );
          return undefined !== orderable ? orderable.key : x[0].key;
        })(this.columns),

        // sebagai pengingat kolom-kolom
        // data yang digunakan sebagai pencarian.
        searchableElement: (function(x) {
          const elements = [];
          for (let i = 0; i < x.length; i++) {
            const def = x[i];
            if (def && true === def.searchable) elements.push(def.prop);
          }

          return elements;
        })(this.columns)
      };
    },
    computed: {
      // listeners() {
      //   return {
      //     ...this.$listeners,
      //     ["sort-change"]: this.onSortChange
      //   };
      // }
    },
    methods: {
      oReadOnly(obj, name, value) {
        return Object.defineProperty(obj, name, {
          writable: false,
          value
        });
      },
      rangeChanged(/*val*/) {
        // console.log(this.dateRange);
        // console.log([val, this.date_end]);
        // console.log(this.dateRange);
      },

      getSortOrder() {
        let sortOrder = {};
        const sort = this.sort,
          columns = this.columns;

        if (sort.length !== 0) {
          const order = sort[0].split("|");
          sortOrder = { column: order[0], dir: order[1] };
        } else if (columns.length !== 0) {
          sortOrder = { column: this.defaultOrderableElement, dir: "asc" };
        }

        return sortOrder;
      },

      fixingTextAlign(targetClassName, className) {
        const trth = document.getElementsByClassName(targetClassName);
        if (trth === null) return;

        for (let i = 0; i < trth.length; i++) {
          const thTdCenteredText = trth[i];
          if (0 !== thTdCenteredText.children.length) {
            thTdCenteredText.children[0].classList.add(className);
            break;
          }
        }
      },

      createParams() {
        this.orderBy = this.getSortOrder();

        const readOnlyParams = {};
        this.oReadOnly(readOnlyParams, "page", this.page);
        this.oReadOnly(readOnlyParams, "limit", this.limit);

        if (this.orderBy.column === null)
          this.orderBy.column = this.defaultOrderableElement;
        this.oReadOnly(readOnlyParams, "order", this.orderBy);

        if (this.enSearch)
          this.oReadOnly(readOnlyParams, "search", this.search || null);

        if (this.enDateFilter)
          this.oReadOnly(readOnlyParams, "dateRange", this.dateRange);

        return readOnlyParams;
      },

      resetPageState() {
        this.page = 1;
        this.total = 0;
        this.totalPage = 0;
        this.total = 0;
      },

      async getTableData(page, search, sortParams) {
        if (this.loading) return;

        this.loading = true;

        this.search = search || null;
        this.page = page || this.page;
        this.sort = sortParams || this.sort;

        const params = this.createParams();
        if (typeof this.beforeReload === "function")
          this.beforeReload.apply(null, []);

        try {
          const response = await this.getData(params);
          this.rows = response.data || [];
          this.totalPage = response.total || 0;
          this.total = response.records || 0;
        } catch (e) {
          console.error(e);
        } finally {
          this.loading = false;
          this.fixingTextAlign("is-center", "fix-column-centered");
          this.fixingTextAlign("is-left", "fix-column-left");

          if (typeof this.loadComplete === "function")
            this.loadComplete.apply(null, []);
        }
      },

      setPage(page) {
        if (this.loading) return;

        this.page = page || this.page;
        this.getTableData(this.page, this.search, this.sort);
      },

      onSortChange({ /*column,*/ prop, ev }) {
        if (this.loading) return;

        let order = ev.target.getAttribute("aria-sort");
        if (!order) return;

        if (order === "none") order = "ascending";
        else if (order === "ascending") order = "descending";
        else order = "ascending";

        this.sort =
          prop !== null
            ? [`${prop}|${order === "ascending" ? "asc" : "desc"}`]
            : [];
        this.getTableData(this.page, this.search, this.sort).then(() => {
          ev.target.setAttribute("aria-sort", order);
        });
      },

      handleTableSearch() {
        if (this.enSearch && !this.loading)
          this.getTableData(this.page, this.search, this.sort);
      },

      refreshTable() {
        if (!this.loading) this.getTableData(this.page, this.search, this.sort);
      }
    },
    created() {
      this.getTableData();
    }
  };
</script>

<style>
    .table td,
    .table th {
        white-space: revert;
    }

    .el-table.table-dark th,
    .el-table.table-dark tr {
        background-color: #172b4d;
    }

    .el-table.table-dark td,
    .el-table.table-dark th.is-leaf {
        border-bottom: none;
    }
</style>
