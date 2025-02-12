<template>
    <nav class="bottom-menu d-md-none d-flex justify-content-around z-2">
        <router-link
            :to="{ name: 'settings' }"
            class="nav-link"
            active-class="active"
        >
            <i class="bi bi-gear fs-2"></i>
            <div>Settings</div>
        </router-link>
        <router-link
            :to="{ name: 'selector' }"
            class="nav-link"
            active-class="active"
        >
            <i class="bi bi-person-raised-hand fs-2"></i>
            <div>Selector</div>
        </router-link>
        <router-link
            :to="{ name: 'card' }"
            class="nav-link"
            active-class="active"
        >
            <i class="bi bi-rocket-takeoff fs-2"></i>
            <div>Card</div>
        </router-link>
    </nav>
    <nav class="top-menu navbar navbar-expand bg-body-tertiary d-none d-md-flex fixed-top">
        <div class="container-fluid">
            <a class="navbar-brand">
                <img
                    src="@/assets/icons/ring.svg"
                    :style="{ height: '30px' }"
                />
            </a>
            <div class="collapse navbar-collapse">
                <div class="navbar-nav">
                    <router-link
                        :to="{ name: 'settings' }"
                        class="nav-link"
                        active-class="active"
                    >
                        <div>Settings</div>
                    </router-link>
                    <router-link
                        :to="{ name: 'selector' }"
                        class="nav-link"
                        active-class="active"
                    >
                        <div>Selector</div>
                    </router-link>
                    <router-link
                        :to="{ name: 'card' }"
                        class="nav-link"
                        active-class="active"
                    >
                        <div>Card</div>
                    </router-link>
                </div>
            </div>
        </div>
    </nav>
</template>

<style>
.bottom-menu {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: white;
    border-top: 1px solid #ddd;
    padding: 10px 0;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}
.bottom-menu .nav-item {
    text-align: center;
    flex: 1;
}
.bottom-menu .nav-link {
    color: #6c757d;
    font-size: 14px;
    display: flex;
    flex-direction: column; /* Text on top, icon below */
    align-items: center;
}
.bottom-menu .nav-link.active {
    color: #007bff;
}
.bottom-menu i {
    font-size: 24px; /* Larger icon */
}
</style>
