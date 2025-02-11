<template>
    <nav class="navbar navbar-expand bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand">
                <img
                    src="@/assets/icons/ring.svg"
                    :style="{ height: '30px' }"
                />
            </a>
            <div class="collapse navbar-collapse">
                <div class="navbar-nav">
                    <a
                        class="nav-link active"
                        aria-current="page"
                        href="#/settings"
                        >Settings</a
                    >
                    <a
                        class="nav-link"
                        href="#/selector"
                        >Selector</a
                    >
                    <a
                        class="nav-link"
                        href="#/card"
                        >Card</a
                    >
                </div>
            </div>
        </div>
    </nav>
</template>
