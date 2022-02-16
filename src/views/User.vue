<template>
  <div>
    <base-header
      class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
      style="
        background-image: url(img/theme/Background.png);
        background-size: cover;
        background-position: center top;
      "
    >
      <!-- Mask -->
      <!-- Header container -->
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-lg-7 col-md-10">
            <h1 class="display-2 text-white">*Nama Admin*</h1>
            <p class="text-white mt-0 mb-5">
              Ini adalah halaman profil Anda. Anda dapat melihat kemajuan yang
              telah Anda buat dengan pekerjaan Anda dan kelola proyek Anda atau
              tugas yang diberikan
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-4 order-xl-2 mb-5 mb-xl-0">
          <div class="card card-profile shadow">
            <div class="row justify-content-center">
              <div class="col-lg-3 order-lg-2">
                <div class="card-profile-image">
                  <a href="#">
                    <img src="img/theme/react.jpg" class="rounded-circle" />
                  </a>
                </div>
              </div>
            </div>
            <div
              class="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4"
            ></div>
            <div class="card-body pt-0 pt-md-4">
              <div class="row">
                <div class="col">
                  <div
                    class="card-profile-stats d-flex justify-content-center mt-md-5"
                  >
                    <div>
                      <span class="heading">0</span>
                      <span class="description">Ticket Di Proses</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-center">
                <h3>*Nama Admin<span class="font-weight-light">, 27</span></h3>
                <div class="h5 font-weight-300">
                  <i class="ni location_pin mr-2"></i>Jakarta, Indonesia
                </div>
                <div class="h5 mt-4">
                  <i class="ni business_briefcase-24 mr-2"></i>IT Operational -
                  SAHYA
                </div>
                <div><i class="ni education_hat mr-2"></i>-</div>
                <hr class="my-4" />
                <p></p>
                <a href="#">Show more</a>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-8 order-xl-1">
          <card shadow type="secondary">
            <template v-slot:header>
              <div class="bg-white border-0">
                <div class="row align-items-center">
                  <div class="col-8">
                    <h3 class="mb-0">Akun Saya</h3>
                  </div>
                </div>
              </div>
            </template>

            <form>
              <h6 class="heading-small text-muted mb-4">Informasi Admin</h6>
              <div class="pl-lg-4">
                <div class="row">
                  <div class="col-lg-6">
                    <base-input
                      alternative=""
                      label="Username"
                      placeholder="Username"
                      input-classes="form-control-alternative"
                      v-model="model.username"
                    />
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      alternative=""
                      label="Email"
                      placeholder="admin@example.com"
                      input-classes="form-control-alternative"
                      v-model="model.email"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6">
                    <base-input
                      alternative=""
                      label="Nama Depan"
                      input-classes="form-control-alternative"
                      v-model="model.firstName"
                    />
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      alternative=""
                      label="Nama Belakang"
                      placeholder="Nama Belakang"
                      input-classes="form-control-alternative"
                      v-model="model.lastName"
                    />
                  </div>
                </div>
              </div>
              <hr class="my-4" />
              <!-- Address -->
              <h6 class="heading-small text-muted mb-4">Kontak Informasi</h6>
              <div class="pl-lg-4">
                <div class="row">
                  <div class="col-md-12">
                    <base-input
                      alternative=""
                      label="Alamat"
                      placeholder="Alamat Lengkap"
                      input-classes="form-control-alternative"
                      v-model="model.address"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-4">
                    <base-input
                      alternative=""
                      label="Kota"
                      placeholder="Kota"
                      input-classes="form-control-alternative"
                      v-model="model.city"
                    />
                  </div>
                  <div class="col-lg-4">
                    <base-input
                      alternative=""
                      label="Kewarganegaraan"
                      placeholder="Kewarganegaraan"
                      input-classes="form-control-alternative"
                      v-model="model.country"
                    />
                  </div>
                  <div class="col-lg-4">
                    <base-input
                      alternative=""
                      label="Kode Pos"
                      placeholder="Kode Pos"
                      input-classes="form-control-alternative"
                      v-model="model.zipCode"
                    />
                  </div>
                </div>
              </div>
              <hr class="my-4" />
              <!-- Description -->
              <h6 class="heading-small text-muted mb-4">Tentang</h6>
              <div class="pl-lg-4">
                <div class="form-group">
                  <base-input alternative="" label="Tentang">
                    <textarea
                      rows="4"
                      class="form-control form-control-alternative"
                      placeholder="A few words about you ..."
                    >
-----</textarea
                    >
                  </base-input>
                </div>
              </div>
            </form>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "User-aja",
  data() {
    return {
      model: {
        username: "Rifan Aldio",
        email: "rifanaldio@gmail.com",
        firstName: "Rifan",
        lastName: "Aldio",
        address: "Jl.Mesjid 7",
        city: "Jakarta",
        country: "Indonesia",
        zipCode: "RIF72717",
        about: "",
      },
    };
  },
};
</script>
<style></style>
