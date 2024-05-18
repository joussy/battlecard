<template>
    <span class="badge ml-2" :class="{
        'bg-danger': modalityError,
        'bg-light': !modalityError,
    }">
        <img src="@/assets/icons/scale.svg" height="16" />
        {{ boxer.attributes.weight }}
    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: ['boxer', 'modalityError'],
});
</script>