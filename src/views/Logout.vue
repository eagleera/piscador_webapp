<template>
    
</template>

<script>
let storeModule = "session";

export default {
    name: "logout",
    mounted() {
        this.$store.dispatch(`${storeModule}/logout`);
    }
}
</script>