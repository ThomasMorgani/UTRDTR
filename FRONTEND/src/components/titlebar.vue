<template>
  <nav
    class="uk-navbar-container uk-navbar-transparent uk-margin-medium-left uk-margin-medium-right"
    uk-navbar
  >
    <div class="uk-navbar-left">
      <router-link to="/" class="uk-navbar-item uk-logo">
        <img
          class="logo"
          src="http://localhost:3000/images/default_avatar.png"
        />
        <span class="header uk-text-primary"> UTRDTR</span>
      </router-link>
    </div>
    <div v-if="$route.name === 'activeGame'" class="uk-navbar-right">
      ROOM: WXYZ
    </div>
  </nav>
</template>
<style scoped>
.uk-navbar-nav > li > a,
.uk-navbar-item,
.uk-navbar-toggle {
  min-height: 50px !important;
  height: 50px !important;
  padding: 0px;
}

.logo {
  padding-right: 10px;
  height: 1em;
}

.header {
  font-weight: bold;
  font-size: 1em;
}

.hi {
  height: 50px;
}
</style>
