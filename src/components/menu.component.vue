<template>
    <nav
        class="bottom-menu d-md-none d-flex justify-content-around z-2 fixed-bottom border-top shadow-sm bg-light-subtle pb-2"
    >
        <router-link
            :to="{ name: 'settings' }"
            class="nav-link text-center"
            active-class="active"
        >
            <i class="bi bi-gear fs-2"></i>
            <div>Settings</div>
        </router-link>
        <router-link
            :to="{ name: 'selector' }"
            class="nav-link text-center"
            active-class="active"
        >
            <i class="bi bi-person-raised-hand fs-2"></i>
            <div>Selector</div>
        </router-link>
        <router-link
            :to="{ name: 'card' }"
            class="nav-link text-center"
            active-class="active"
        >
            <i class="bi bi-rocket-takeoff fs-2"></i>
            <div>Card</div>
        </router-link>
    </nav>
    <ul class="nav nav-underline fixed-top bg-light-subtle d-none d-md-flex">
        <li class="navbar-brand">
            <img
                src="@/assets/icons/ring.svg"
                :style="{ height: '30px' }"
            />
        </li>
        <li class="nav-item">
            <router-link
                :to="{ name: 'settings' }"
                class="nav-link link-secondary"
                active-class="active"
            >
                Settings
            </router-link>
        </li>
        <li class="nav-item">
            <router-link
                :to="{ name: 'selector' }"
                class="nav-link link-secondary"
                active-class="active"
            >
                Selector
            </router-link>
        </li>
        <li class="nav-item">
            <router-link
                :to="{ name: 'card' }"
                class="nav-link link-secondary"
                active-class="active"
            >
                Card
            </router-link>
        </li>
    </ul>
</template>

<style>
.bottom-menu .nav-link {
    color: #6c757d;
    font-size: 14px;
}
.bottom-menu .nav-link.active {
    color: #007bff;
}
</style>
