<template>
  <div>
    <base-header
      class="pb-4 pb-6 pt-2 pt-2"
      style="background-image: url(img/theme/Background.png)"
    ></base-header>
    <div>
      <b-jumbotron color="primary" margin="0rem">
        <projects-ticket title="tickets"></projects-ticket>
      </b-jumbotron>
    </div>
  </div>
</template>
<script>
import ProjectsTicket from "./Ticket/ProjectsTicket";
export default {
  name: "ticket-bro",
  components: {
    ProjectsTicket,
  },
};
</script>
<style></style>
