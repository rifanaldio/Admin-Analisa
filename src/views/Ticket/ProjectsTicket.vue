<template>
  <div class="card shadow">
    <!--:class="type === 'dark' ? 'bg-transparent' : ''"-->
    <div>
      <div class="card-header"></div>

      <div>
        <b-modal
          header-bg-variant="success"
          id="modal-lg-1"
          size="mb"
          class="mb2"
          v-if="show"
          hide-backdrop
          content-class="shadow"
          ref="kirim_tiket_modal"
          :hide-footer="true"
        >
          <b-form @submit.prevent="sendEmail">
            <div class="form-group">
              <label><b>Email Pelapor</b></label>
              <input
                type="email"
                readonly
                class="form-control"
                name="email_pelapor"
                v-model="form_kirim_tiket.email_tiket"
              />
            </div>
            <input
              type="hidden"
              name="admin_email"
              value="admin_rifan@gmail.com"
            />
            <b-form-group>
              <label><b>Deskripsi Pelapor</b></label>
              <input
                name="deskripsi"
                v-model="form_kirim_tiket.deskripsi"
                readonly
                cols="30"
                rows="5"
                class="form-control"
                placeholder="Message"
              />
            </b-form-group>

            <div>
              <label><b>Divisi</b></label>
              <b-form-select v-model="selected" class="mb-3" required>
                <b-form-select-option-group label="Divisi Teknis">
                  <b-form-select-option value="Divisi Teknis (Kriwul)"
                    >Divisi Teknis : Kriwul
                  </b-form-select-option>

                  <b-form-select-option value="Divisi Teknis (Syahrul)" disabled
                    >Divisi Teknis : Syahrul
                  </b-form-select-option>

                  <b-form-select-option value="Divisi Teknis (Dimas)"
                    >Divisi Teknis : Dimas
                  </b-form-select-option>
                </b-form-select-option-group>

                <b-form-select-option-group label="Divisi Database">
                  <b-form-select-option value="Divisi Database (Faisal)"
                    >Divisi Database : Faisal
                  </b-form-select-option>
                </b-form-select-option-group>

                <b-form-select-option-group label="Divisi Server">
                  <b-form-select-option value="Divisi Server (Rusdy)"
                    >Divisi Server : Rusdy
                  </b-form-select-option>
                </b-form-select-option-group>
              </b-form-select>

              <input
                hidden
                class="form-control"
                name="selected"
                readonly
                v-model="form_kirim_tiket.selected"
              />
            </div>

            <b-button
              class="mt-2"
              variant="outline-success"
              block
              squared
              pill
              size="sm"
              type="submit"
              value="Send"
              icon="ni ni-send"
            >
              Kirim Ticket</b-button
            >
          </b-form>
        </b-modal>
      </div>
      <!-- modal pembuatan ticket -->
      <div>
        <b-modal
          ref="modalku"
          id="modal-lg"
          size="lg"
          class="mb2"
          v-if="show"
          hide-backdrop
          content-class="shadow"
          title="Tambahkan Ticket"
          :hide-footer="true"
        >
          <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
            <b-form-group
              label="Email Pelapor"
              id="input-group-1"
              label-for="input-1"
            >
              <b-form-input
                id="input-1"
                v-model="form.email"
                type="email"
                required
                trim
                placeholder="name@example.com"
              ></b-form-input>
            </b-form-group>

            <div class="form-group">
              <label for="input-x2">Tanggal</label>
              <input
                type="date"
                required
                readonly
                tabindex="-1"
                id="input-x2"
                class="form-control w-25"
                v-model="form.tanggal"
              />
            </div>

            <b-form-group label="Status" id="input-group-3" label-for="input-3">
              <input
                readonly
                required
                tabindex="-1"
                id="input-3"
                v-model="form.status"
                class="form-control w-25"
              />
            </b-form-group>
            <b-form-group
              label="Deskripsi"
              id="input-gorup-4"
              label-for="input-4"
            >
              <b-form-textarea
                id="input-4"
                v-model="form.deskripsi"
                placeholder="Tambahkan Deskripsi..."
                rows="3"
                max-rows="6"
                required
              ></b-form-textarea>
            </b-form-group>
            <b-form-group
              label="Masukan Gambar (Opsional)"
              id="input-gorup-5"
              label-for="input-5"
            >
              <b-form-file
                id="input-4"
                v-model="form.file"
                class="mt-3"
                plain
                type="file"
                accept=".png,.jpg,.jpeg,.jiff"
              ></b-form-file>
            </b-form-group>
            <!--@click="showMsgBoxTwo"-->
            <b-button type="submit" variant="primary">Submit</b-button>
            <b-button type="reset" variant="danger">Reset</b-button>
          </b-form>
        </b-modal>
      </div>
      <div class="box"></div>
      <!-- //tools diatas table -->
      <div class="container">
        <b-row>
          <b-col>
            <b-button
              v-b-modal.modal-lg
              type="button"
              variant="success"
              :click="onReset"
              >Tambah Ticket</b-button
            >
          </b-col>

          <b-col>
            <b-form-group
              label="Filter"
              label-for="filter-input"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input
                  id="filter-input"
                  v-model="filter"
                  type="search"
                  placeholder="Type to Search"
                ></b-form-input>
              </b-input-group>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group
              label="Per page"
              label-for="per-page-select"
              label-cols-sm="6"
              label-cols-md="4"
              label-cols-lg="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
            >
              <b-form-select
                id="per-page-select"
                v-model="perPage"
                :options="pageOptions"
                size="sm"
              ></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
      <div class="container">
        <b-row>
          <b-col> </b-col>
          <b-col> </b-col>
          <b-col> </b-col>
          <b-col>
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
          </b-col>
        </b-row>
      </div>
      <div class="box"></div>

      <b-table
        id="my-table"
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :filter-included-fields="filterOn"
        stacked="md"
        hover
        head-variant="light"
        bordered
        no-border-collapse
        show-empty
        primary-key="email"
        small
        @filtered="onFiltered"
      >
        <!-- tempat field berubah karena edit -->
        <template v-slot:cell(email)="{ item, index, field: { key } }">
          <input
            v-if="item.edit"
            type="text"
            class="form-control input-sm"
            v-model="edited_row[index]"
          />
          <span v-else>{{ item[key] }}</span>
        </template>
        <!-- actions pada table (Edit dan Save) -->

        <template v-slot:cell(actions)="{ index, item }">
          <b-button
            :disabled="item.complete"
            variant="info"
            size="sm"
            @click="onEdit(item, index)"
            v-if="!item.edit"
            ><b-icon icon="gear-fill" aria-hidden="true"></b-icon>
            Edit</b-button
          >
          <b-button
            variant="success"
            size="sm"
            @click="onSave(item, index)"
            v-else
            ><b-icon icon="inbox-fill"></b-icon> Simpan</b-button
          >

          <b-button
            variant="danger"
            v-if="!item.complete"
            size="sm"
            @click="onDelete(item.email)"
            ><b-icon icon="trash-fill" aria-hidden="true"></b-icon>
            Hapus</b-button
          >
        </template>
        <!-- actions untuk melihat detail table -->
        <template #cell(show_details)="row">
          <b-button
            variant="primary"
            size="sm"
            @click="row.toggleDetails"
            class="mr-2"
            >{{ row.detailsShowing ? " Hide" : "Show" }}
          </b-button>
        </template>
        <!-- isi detail table -->
        <template #row-details="row">
          <div>
            <b-card>
              <b-form-group>
                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"><b>Email :</b></b-col>
                  <b-col>{{ row.item.email }}</b-col>
                </b-row>

                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"><b>Status :</b></b-col>
                  <b-col> {{ row.item.status }} </b-col>
                </b-row>

                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"
                    ><b>Tanggal Dibuat :</b></b-col
                  >
                  <b-col>{{ row.item.tanggal }}</b-col>
                </b-row>

                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"
                    ><b>Tanggal Selesai :</b></b-col
                  >
                  <b-col>{{ row.item.done }}</b-col>
                </b-row>

                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"><b>Deskripsi :</b></b-col>
                  <b-col>{{ row.item.deskripsi }}</b-col>
                </b-row>

                <b-row class="mb-2" id="preview">
                  <b-col sm="3" class="text-sm-right"><b>File :</b></b-col>
                  <b-col>
                    <img
                      v-if="row.item.file_preview"
                      :src="row.item.file_preview"
                      style="max-width: 25%"
                    />
                  </b-col> </b-row
              ></b-form-group>

              <!-- <b-button
                v-if="!row.item.complete"
                v-b-modal.modal-lg-1
                squared
                pill
                variant="success"
                size="sm"
                >Buat Ticket</b-button
              > -->
              <b-button
                v-if="!row.item.complete"
                squared
                pill
                variant="success"
                size="sm"
                @click="setFormData(row)"
                ><b-icon icon="envelope" aria-hidden="true"></b-icon> Kirim
                Ticket</b-button
              >
              <b-button
                v-if="!row.item.pending"
                squared
                pill
                variant="danger"
                size="sm"
                >Unduh Data</b-button
              >
            </b-card>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import emailjs from "emailjs-com";
const date_now = () => new Date().toISOString("id-ID").replace(/T.*/, "");

export default {
  name: "ticket-bro",

  data() {
    return {
      message: "",
      selected: "",
      form_kirim_tiket: {
        rowIndex: -1,
        email_tiket: "",
        deskripsi: "",
      },
      url: null,
      date_now: date_now(),
      options: [{ value: "Belum Di Kirim", text: "Belum Di Kirim" }],
      form: {
        email: "",
        status: "Belum Di Kirim",
        file: null,
        deskripsi: "",
        tanggal: date_now(),
        tanggal_selesai: date_now(),
      },
      show: true,
      edited_row: {},

      fields: [
        {
          key: "email",
          sortable: true,
          label: "Email",
          sortByFormatted: true,
          filterByFormatted: true,
        },
        {
          key: "status",
          sortable: true,
          label: "Status",
          sortByFormatted: true,
          filterByFormatted: true,
        },
        {
          key: "tanggal",
          sortable: true,
          label: "Tanggal",
          sortByFormatted: true,
          filterByFormatted: true,
        },
        {
          key: "actions",
          label: "Actions",
          disabled: true,
        },
        {
          key: "show_details",
          label: "Details",
        },
      ],

      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      filter: null,
      sortDesc: false,
      sortByFormatted: true,
      filterByFormatted: true,
      filterOn: [],

      items: [
        {
          email: "Rifan@corporate.com",
          status: "Selesai",
          tanggal: "2021-12-29",
          tanggal_selesai: false,
          deskripsi: "Fitur Support tidak dapat dibuka",
          file: null,
          file_preview: null,
          edit: false,
          complete: true,
          pending: false,
        },

        {
          email: "Rama@corporate.com",
          status: "Selesai",
          tanggal: "2021-12-29",
          tanggal_selesai: false,
          deskripsi: "Akun saya tidak dapat login , ID RIF222",
          file: null,
          file_preview: null,
          edit: false,
          complete: true,
          pending: false,
        },
        {
          email: "Rusdy@corporate.com",
          status: "Selesai",
          tanggal: "2021-12-29",
          tanggal_selesai: false,
          deskripsi: "tidak dapat login kedalam akun",
          file: null,
          file_preview: null,
          edit: false,
          complete: true,
          pending: false,
        },
        {
          email: "Paishal@corporate.com",
          status: "Belum Di Kirim",
          tanggal: "2021-11-29",
          tanggal_selesai: "",
          deskripsi:
            "tidak dapat melakukan spesimen tanda tangan pada ID KJL12",
          file: null,
          file_preview: null,
          edit: false,
          complete: false,
          pending: true,
        },
        {
          email: "Mailer@corporate.com",
          status: "Belum Di Kirim",
          tanggal: "2021-11-31",
          tanggal_selesai: "",
          deskripsi: "Login terlalu lama ",
          file: null,
          file_preview: null,
          edit: false,
          complete: false,
          pending: true,
        },
      ],
    };
  },

  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key, icon: "" };
        });
    },

    rows() {
      return this.items.length;
    },
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
  },
  methods: {
    resetFormTiket() {
      this.form_kirim_tiket.rowIndex = -1;
      this.form_kirim_tiket.email_tiket = null;
      this.form_kirim_tiket.selected = null;
      // this.form_kirim_tiket.file_attachment = null;
      this.form_kirim_tiket.deskripsi = null;
    },
    setFormData(row) {
      const items = row.item;

      this.form_kirim_tiket.rowIndex = row.index;
      this.form_kirim_tiket.email_tiket = items.email;
      this.form_kirim_tiket.selected = items.selected;
      // this.form_kirim_tiket.file_attachment = items.file;
      this.form_kirim_tiket.deskripsi = items.deskripsi;
      this.$refs.kirim_tiket_modal.show();
    },
    toDataURL: (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        return reader.readAsDataURL(file);
      });
    },
    async sendEmail() {
      const result = await Swal.fire({
        showCancelButton: true,
        icon: "warning",
        title: "Kirim Data Sebagai Tiket",
        input: "checkbox",
        inputPlaceholder: "Saya setuju dengan syarat dan ketentuan",
        confirmButtonText: "Kirim ",
        inputValidator: (result) => {
          return !result && "Anda harus menyetujui Syarat dan Ketentuan";
        },
      });
      if (!result.isConfirmed) {
        this.$refs.kirim_tiket_modal.hide();
        // Reset form field
        this.resetFormTiket();
        return;
      }
      this.$refs.kirim_tiket_modal.hide();
      Swal.fire({ title: "Tiket Berhasil Dikirim", icon: "success" });

      // console.log(a, typeof emailjs);

      // console.log(file_base64, typeof emailjs);
      await emailjs
        .send(
          "service_5gu45rv",
          "template_p95zyr3",
          // e.target,
          {
            email_pelapor: this.form_kirim_tiket.email_tiket,
            deskripsi: this.form_kirim_tiket.deskripsi,
            selected: this.selected,
            admin_email: "Admin Rifan",
            // message: this.meessage,
          },
          "user_6OXbkVzr00iwEg5fGX2q5"
        )
        .then(() => {
          console.log("Sukses");

          this.ticketDone(this.items[this.form_kirim_tiket.rowIndex]);
        })
        .catch((error) => {
          console.error({ error });
        })
        .finally(() => {
          // Reset form field
          this.resetFormTiket();
        });
    },
    //Method Untuk melakukan edit pada row
    onEdit(items, index) {
      items.edit = true;
      this.edited_row[index] = items.email;
    },

    //Method untuk melakukan save , "Save" keluar setelah Edit
    onSave(items, index) {
      Swal.fire({
        title: "Simpan Perubahan Pada Table?",
        showDenyButton: true,
        input: "checkbox",
        confirmButtonText: "Simpan",
        denyButtonText: `Jangan Simpan`,
        inputPlaceholder: "Saya setuju dengan syarat dan ketentuan",
        inputValidator: (result) => {
          return !result && "Anda harus menyetujui Syarat dan Ketentuan";
        },
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        items.edit = false;
        if (result.isConfirmed) {
          items.email = this.edited_row[index];

          Swal.fire("Tersimpan!", "Perubahan Berhasil Di Simpan", "success");
        } else if (result.isDenied) {
          Swal.fire("Perubahan Tidak Disimpan", "", "info");
        }

        delete this.edited_row[index];
      });
    },

    //Melakukan delete pada row yang dipilih
    onDelete(email) {
      Swal.fire({
        title: "Apa Anda Yakin??",
        text: "Anda tidak akan dapat mengembalikan ini!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Hapus Sekarang!",
        input: "checkbox",
        inputPlaceholder: "Saya setuju dengan syarat dan ketentuan",
        inputValidator: (result) => {
          return !result && "Anda harus menyetujui Syarat dan Ketentuan";
        },
      }).then((result) => {
        if (!result.isConfirmed) {
          return;
        }
        const index = this.items.findIndex((items) => items.email === email);
        if (index < 0)
          return void Swal.fire(
            "Gagal Menghapus!",
            "Gagal menghapus data",
            "error"
          );
        //fitur delete
        this.items.splice(index, 1);
        Swal.fire("Terhapus!", "File Anda Berhasil Dihapus.", "success");
      });
      // this.items.splice(id, 1);
    },

    //fitur untuk upload file (foto) saaat melakukan penambahan ticket
    onFileChange(items) {
      const file = items.target.files[0];
      this.url = URL.createObjectURL(file);
    },

    //method untuk melakukan pengiriman ticket pada table
    onTicket(items) {
      Swal.fire({
        showCancelButton: true,
        icon: "warning",
        title: "Kirim Data Sebagai Tiket",
        input: "checkbox",
        inputPlaceholder: "Saya setuju dengan syarat dan ketentuan",
        confirmButtonText: "Kirim ",
        inputValidator: (result) => {
          return !result && "Anda harus menyetujui Syarat dan Ketentuan";
        },
      }).then((result) => {
        if (!result.isConfirmed) {
          return;
        }

        //yang terjadi setelah melakukan pengiriman ticket
        this.ticketDone(items);
        Swal.fire({ title: "Tiket Berhasil Dikirim", icon: "success" });
      });
    },

    /** yang terjadi setelah melakukan pengiriman ticket */
    ticketDone(items) {
      items.status = "Selesai";
      items.done = date_now();
      items.complete = true;
      items.pending = false;
    },

    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    //Method untuk melakukan penambahan data pada Table
    onSubmit(evt) {
      evt.preventDefault();

      Swal.fire({
        title: "Success!",
        text: "Data Berhasil Di Tambahkan",
        icon: "success",
        confirmButtonText: "OK",
      });

      const image_data =
        this.form.file && this.form.file.length != 0
          ? URL.createObjectURL(this.form.file)
          : null;

      //item apa saja yang di push ke dalam table
      this.items.push({
        email: this.form.email,
        status: this.form.status,
        tanggal: this.form.tanggal,
        deskripsi: this.form.deskripsi,
        file: this.form.file,
        //untuk melihat file yang di dalam table
        file_preview: image_data,
        //fitur edit
        edit: false,
        //fitur yang menonaktifkan beberapa button ketika ticket telah dikirim
        complete: false,
        //fitur yang muncul setelah melakukan pengiriman ticket
        pending: true,
        //tanggal selesai
        done: this.form.done,
      });
      this.$refs.modalku.hide();
      this.resetForm();
    },

    resetForm() {
      this.form.email = "";
      this.form.status = "Belum Di Kirim";
      this.form.tanggal = date_now();
      this.form.deskripsi = "";
      this.form.file = null;
      this.form_action = "Insert";
    },

    onReset(evt) {
      evt.preventDefault();

      this.resetForm();
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },

    showMsgBoxOne() {
      this.boxOne = "";
      this.$bvModal
        .msgBoxConfirm("Please confirm that you want to delete everything.", {
          title: "Please Confirm",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          this.boxOne = value;
        })
        .catch(() => {
          // An error occurred
        });
    },
  },
};
</script>
<style>
.box {
  width: 10px;
  height: 3px;
  background: rgb(255, 254, 254);
  margin: 10px;
}
</style>
