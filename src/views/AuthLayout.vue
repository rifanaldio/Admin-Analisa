<template>
  <div class="main-content">
    <img
      :src="background_login"
      referrerpolicy="origin-when-cross-origin"
      alt=""
      class="background-login"
    />
    <base-nav
      v-model="showMenu"
      :transparent="true"
      menu-classes="justify-content-end"
      class="navbar-horizontal navbar-main navbar-top navbar-dark"
      :expand="true"
    >
      <div class="navbar-wrapper">
        <b-navbar-brand to="/"> </b-navbar-brand>
      </div>

      <template>
        <div class="navbar-collapse-header">
          <b-row>
            <b-col cols="6" class="collapse-brand">
              <a href="https://sahya.id/">
                <!--<img src="img/brand/green.png">-->
                Home
              </a>
            </b-col>
            <b-col cols="6" class="collapse-close">
              <button
                type="button"
                class="navbar-toggler"
                @click="showMenu = false"
              >
                <span></span>
                <span></span>
              </button>
            </b-col>
          </b-row>
        </div>
        <b-navbar-nav class="align-items-lg-center ml-lg-auto">
          <!--<b-nav-item to="/dashboard">
            <i class="ni ni-planet"></i>
            <span class="nav-link-inner&#45;&#45;text">Dashboard</span>
          </b-nav-item>-->
          <b-nav-item to="/register">
            <i class="ni ni-circle-08"></i>
            <span class="nav-link-inner--text">Register</span>
          </b-nav-item>
          <b-nav-item to="/login">
            <i class="ni ni-key-25"></i>
            <span class="nav-link-inner--text">Login</span>
          </b-nav-item>
          <!--<b-nav-item to="/profile">
            <i class="ni ni-single-02"></i>
            <span class="nav-link-inner&#45;&#45;text">Profile</span>
          </b-nav-item>-->
        </b-navbar-nav>
      </template>
    </base-nav>

    <div class="main-content">
      <zoom-center-transition :duration="pageTransitionDuration" mode="out-in">
        <router-view></router-view>
      </zoom-center-transition>
    </div>

    <footer
      v-if="!$route.meta.hideFooter"
      class="py-5 top-footer mt-5 text-left"
      id="footer-main"
    >
      <b-container>
        <div class="nav-footer justify-content-center justify-content-xl-end">
          <b-row class="text-center text-sm-center text-md-left text-lg-left">
            <b-col
              cols="12"
              sm="12"
              md="4"
              lg="4"
              class="mt-4 mt-sm-4 mt-md-0 mt-lg-0"
            >
              <h3>Alamat</h3>
              <p>
                Jl. Cigadung Raya Barat No.6 Cigadung, Kec. Cibeunying Kaler,
                Kota Bandung, Jawa Barat 40191, Indonesia
              </p>
            </b-col>
            <!-- End of .col-sm-3 -->

            <b-col
              cols="12"
              sm="12"
              md="4"
              lg="4"
              class="mt-4 mt-sm-4 mt-md-0 mt-lg-0"
            >
              <ul>
                <li><h3>Our Services</h3></li>
                <li><a href="#">System Development</a></li>
                <li><a href="#">Data Security Services</a></li>
              </ul>
            </b-col>
            <!-- End of .col-sm-3 -->

            <b-col
              cols="12"
              sm="12"
              md="4"
              lg="4"
              class="mt-4 mt-sm-4 mt-md-0 mt-lg-0"
            >
              <ul>
                <li><h3>Quick Links</h3></li>
                <li><a href="#">Partners</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">FAQs</a></li>
                <li><a href="#">Badges</a></li>
              </ul>
            </b-col>
            <!-- End of .col-sm-3 -->
          </b-row>
        </div>
      </b-container>
    </footer>
    <footer v-if="!$route.meta['hideFooter']" class="footer-bottom">
      <div class="copyright text-center text-muted">
        © {{ year }}
        <span class="font-weight-bold ml-1">PT. Sah Indonesia Jaya</span>
      </div>
    </footer>
  </div>
</template>
<script>
import BaseNav from "../components/BaseNav";
import { ZoomCenterTransition } from "vue2-transitions";

export default {
  components: {
    BaseNav,
    ZoomCenterTransition,
  },
  props: {
    backgroundColor: {
      type: String,
      default: "black",
    },
  },
  data() {
    return {
      showMenu: false,
      menuTransitionDuration: 250,
      pageTransitionDuration: 200,
      background_login: `${this.$root.$data["BASE_URL"]}assets/background-login-3.png`,
      navbarBrandImage: `${this.$root.$data["BASE_URL"]}assets/logo-white-sahya.png`,
      year: new Date().getFullYear(),
      pageClass: "login-page",
    };
  },
  computed: {
    title() {
      return `${this.$route.name} Page`;
    },
  },
  methods: {
    toggleNavbar() {
      document.body.classList.toggle("nav-open");
      this.showMenu = !this.showMenu;
    },
    closeMenu() {
      document.body.classList.remove("nav-open");
      this.showMenu = false;
    },
    setBackgroundColor() {
      document.body.classList.add("bg-default");
    },
    removeBackgroundColor() {
      document.body.classList.remove("bg-default");
    },
    updateBackground() {
      if (!this.$route.meta["noBodyBackground"]) {
        this.setBackgroundColor();
      } else {
        this.removeBackgroundColor();
      }
    },
  },
  beforeUnmount() {
    this.removeBackgroundColor();
  },
  beforeRouteUpdate(to, from, next) {
    // Close the mobile menu first then transition to next page
    if (this.showMenu) {
      this.closeMenu();
      setTimeout(() => {
        next();
      }, this.menuTransitionDuration);
    } else {
      next();
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler: function () {
        this.updateBackground();
      },
    },
  },
};
</script>
<style lang="scss">
$scaleSize: 0.8;
@keyframes zoomIn8 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  100% {
    opacity: 1;
  }
}

.main-content .zoomIn {
  animation-name: zoomIn8;
}

@keyframes zoomOut8 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}

.main-content .zoomOut {
  animation-name: zoomOut8;
}

footer.top-footer ul li a {
  font-size: 13px;
  line-height: 30px;
  color: #bdbdbd;
  font-weight: 300;
  letter-spacing: 1px;
  text-transform: capitalize;
  transition: color 0.3s;
  font-family: "Source Sans Pro", sans-serif;
  display: block;
}

footer.top-footer ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

footer.top-footer {
  background-color: #222222;
  border-top: 1px solid #404040;
  padding: 100px 0 80px;
}

footer.top-footer p {
  font-size: 13px;
  line-height: 30px;
  color: #bdbdbd;
  font-weight: 300;
  letter-spacing: 1px;
  padding-right: 20px;
  font-family: "Source Sans Pro", sans-serif;
}

footer.top-footer ul li a {
  font-size: 13px;
  line-height: 30px;
  color: #bdbdbd;
  font-weight: 300;
  letter-spacing: 1px;
  text-transform: capitalize;
  transition: color 0.3s;
  font-family: "Source Sans Pro", sans-serif;
  display: block;
}

footer.top-footer h1,
footer.top-footer h2,
footer.top-footer h3,
footer.top-footer h4 {
  color: #fff;
}

footer.footer-bottom {
  text-align: center;
  background-color: #1b1b1b;
  border-top: 1px solid #2c2c2c;
  padding: 30px 0 30px;
  font-family: "Source Sans Pro", sans-serif;
}
</style>

<style scoped>
.background-login {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
  z-index: -2;
}
</style>
