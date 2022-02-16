<template>
  <div>
    <b-card no-body>

      <csi-data-table class="source-sans-pro table-sm" :get-data="getData" :columns="columns" :limit="limit" ref="table" :en-search="enSearch" :en-date-filter="enDateFilter">
        <!--Data Kolom yang akan ditampilkan sebagai kolom table-->
        <b slot="sahya_id" slot-scope="{row}">{{row['sahya_id']|upperCase}}</b>
        <div slot="nama" slot-scope="{row}">
          <dl>
            <dd><b>Nama : {{row['nama']}}</b></dd>
            <dd><b>Tanggal Lahir : {{row['tanggal_lahir']}}</b></dd>
          </dl>
        </div>
        <div slot="mobile" slot-scope="{row}">
          <dl>
            <dd><b>Alamat Email : {{row.email}}</b></dd>
            <dd><b>No. Hanphone : {{row.mobile}}</b></dd>
          </dl>
        </div>
        <b slot="status" slot-scope="{row}" class="text-center">{{ row['status'] }}</b>
        <b slot="verifier_name" slot-scope="{row}" class="text-center">{{ (row['verifier_name'] || "--")|upperCase }}</b>

      </csi-data-table>

    </b-card>
  </div>

</template>

<script>
  import CsiDataTable from "@/components/app-component/CsiDataTable";

  import 'viewerjs/dist/viewer.css'

  export default {
    name: 'ListUsers',
    components: {
      CsiDataTable
    },
    data() {
      return {
        // untuk di eksport ke dataTable component
        enSearch: true,
        enDateFilter: false,
        limit: 10,

        isBusy: false,
        
        promptData: {},
        promptMessage: null,

        columns: [
          {
            key: "sahya_id",
            label: "Sahya ID",
            sortable: false,
            searchable: true,
            width: 10,
            align: "left"
          },
          {
            key: "nama",
            label: "Nama dan Tanggal Lahir",
            sortable: false,
            searchable: true,
            width: 25,
            align: "left"
          },
          {
            key: "mobile",
            label: "Kontak",
            sortable: true,
            searchable: false,
            width: 22,
            align: "left"
          },
          {
            key: "status",
            label: "Status",
            sortable: false,
            searchable: false,
            width: 15,
            align: "center"
          },
          {
            key: "verifier_name",
            label: "Verifikasi Pendaftaran oleh",
            sortable: false,
            searchable: false,
            align: "left"
          }
        ]
      };
    },

    methods: {
      refreshTable() {
        this.$refs.table.refreshTable();
      },

      reflect(response, retval) {
        if (!response) {
          this.showErrorMessage("Gagal memproses data");
          return retval;
        }

        if (false === response.ok) {
          this.showErrorMessage("Terjadi kesalahan saat memproses data", response.statusText);
          return retval;
        }

        const responseBody = response.body;
        if (Object.prototype.hasOwnProperty.call(responseBody, "error")) {
          this.showErrorMessage("Terjadi kesalahan saat memproses data", `[${responseBody.error.type}]`, responseBody.error.description);
          return retval;
        }

        return "success";
      },

      resetPromptData() {
        this.promptData = {};
        this.promptMessage=null;
      },

      async getData({page, search, order, limit}) {
        const response = await this.$http.post(`${this.$root.$data["api_url"]}operators/list-user`, {
          page: page,
          rows: limit,
          search: search,
          sidx: order.column,
          sord: order.dir,
        })/*.then((res) => res.json())*/;
        const noData = {data: [], records: 0, total: 0};
        const reflect = this.reflect(response, noData);
        if (reflect !== "success")
          return reflect;

        const responseData = response.body.data;
        return {
          data: responseData.rows,
          records: responseData.records,
          total: responseData.total
        }
      },
    }
  }
</script>