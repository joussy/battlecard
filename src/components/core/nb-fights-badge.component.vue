<template>
    <span class="badge bg-light ml-2 pt-0 pb-0">
        <img src="@/assets/icons/medal.svg" height="16" />
        {{ boxer.attributes.nbFights }}
    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: ['boxer'],
});
</script>