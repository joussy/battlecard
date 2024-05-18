<template>
    <span class="badge bg-light ml-2 pt-0 pb-0">
        <img src="@/assets/icons/scale.svg" height="16" />
        {{ boxer.attributes.weight }}
    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: ['boxer'],
});
</script>