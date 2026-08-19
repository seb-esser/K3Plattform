<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden rounded-2xl border border-border bg-surface px-6 py-12 md:px-14 md:py-20">
      <svg
        class="pointer-events-none absolute -right-16 -top-10 h-[340px] w-[340px] opacity-[0.55] md:-right-6 md:-top-16 md:h-[460px] md:w-[460px]"
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M200,20 C280,15 355,70 375,150 C395,230 370,310 300,355 C230,400 130,395 75,340 C20,285 15,195 55,120 C95,45 150,25 200,20 Z"
          stroke="var(--color-primary-lighter)"
          stroke-width="1.5"
          opacity="0.35"
        />
        <path
          d="M195,55 C260,50 320,95 335,160 C350,225 325,290 270,325 C215,360 135,350 95,305 C55,260 55,190 85,135 C115,80 150,60 195,55 Z"
          stroke="var(--color-moss)"
          stroke-width="1.5"
          opacity="0.4"
        />
        <path
          d="M195,90 C245,85 290,120 300,170 C310,220 290,270 245,295 C200,320 140,310 110,275 C80,240 80,185 105,145 C130,105 160,95 195,90 Z"
          stroke="var(--color-primary-light)"
          stroke-width="1.5"
          opacity="0.5"
        />
        <path
          d="M195,125 C230,120 265,145 272,180 C280,215 262,250 228,268 C195,285 150,278 128,250 C105,222 105,182 125,155 C145,128 165,130 195,125 Z"
          stroke="var(--color-moss-dark)"
          stroke-width="1.5"
          opacity="0.45"
        />
        <path
          d="M198,155 C220,152 240,168 244,190 C248,212 235,232 213,242 C190,252 165,245 152,228 C138,210 140,185 155,168 C168,152 180,158 198,155 Z"
          stroke="var(--color-accent-dark)"
          stroke-width="1.5"
          opacity="0.5"
        />
      </svg>

      <div class="relative max-w-xl">
        <p class="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-moss-dark">K3 Plattform</p>
        <h1 class="text-[2.5rem] leading-[1.08] text-primary-dark md:text-[3.2rem]">
          Jugendarbeit im Landkreis,<br />
          <span class="italic font-normal text-primary-light">an einem Ort.</span>
        </h1>
        <p class="mt-5 max-w-md text-[1.05rem] leading-relaxed text-text-muted">
          Ein Verbundprojekt von KJR und KoJa Weilheim-Schongau: Angebote von Jugendrotkreuz, THW-Jugend und vielen
          weiteren Akteur:innen &ndash; gesammelt, gepflegt und auf einer Karte sichtbar gemacht.
        </p>
        <div class="mt-7 flex flex-wrap gap-3">
          <RouterLink to="/map" class="btn btn-primary">Zur Karte</RouterLink>
          <RouterLink to="/submit" class="btn btn-outline">Angebot einsenden</RouterLink>
        </div>
      </div>
    </section>

    <!-- Was ist das -->
    <section ref="whatTarget" class="reveal mt-16 grid gap-6 md:grid-cols-[200px_1fr] md:gap-12" :class="{ 'is-visible': whatVisible }">
      <div>
        <p class="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-moss-dark">Der Prototyp</p>
        <p class="font-serif text-4xl italic font-light text-primary-light">Warum?</p>
      </div>
      <div class="max-w-[62ch] text-[1.02rem] leading-relaxed [&_p]:my-3">
        <p>
          Diese Plattform ist ein Prototyp, anhand dessen zukünftige Projektentwicklungen für die Jugendarbeit im
          Landkreis Weilheim-Schongau entwickelt und getestet werden sollen.
        </p>
        <p>
          Der Fokus liegt zu Beginn auf der Bereitstellung einer Koordinationsplattform, um die Verteilung von
          Informationen von und für Akteur:innen der Jugendarbeit im Landkreis zu verbessern.
        </p>
      </div>
    </section>

    <!-- Träger -->
    <section
      ref="trainTarget"
      class="reveal mt-16"
      :class="{ 'is-visible': trainVisible }"
    >
      <p class="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-moss-dark">Die Träger</p>
      <h2 class="mb-6 text-xl">Zwei Träger, ein Ziel</h2>

      <div class="grid gap-5 md:grid-cols-2">
        <div class="card">
          <img src="/logos/kjr.png" alt="KJR Weilheim-Schongau" class="mb-4 h-14 w-auto rounded-md bg-white p-1" />
          <h3 class="mb-1.5 text-lg">Kreisjugendring Weilheim-Schongau</h3>
          <p class="text-sm text-text-muted">
            Interessenvertretung der Jugendverbände im Landkreis und Träger vielfältiger Angebote der
            Jugendarbeit.
          </p>
          <a href="https://kjr-wm-sog.de" target="_blank" rel="noopener" class="mt-4 inline-block text-sm font-semibold underline">
            kjr-wm-sog.de
          </a>
        </div>
        <div class="card md:mt-10">
          <img src="/logos/logo-koja.jpg" alt="KoJa Weilheim-Schongau" class="mb-4 h-14 w-auto rounded-md bg-white p-1" />
          <h3 class="mb-1.5 text-lg">Kommunale Jugendarbeit Weilheim-Schongau</h3>
          <p class="text-sm text-text-muted">
            Koordiniert und unterstützt kommunale Jugendarbeit im Landkreis &ndash; als Bindeglied zwischen
            Gemeinden, Verbänden und Jugendlichen.
          </p>
          <a
            href="https://www.weilheim-schongau.de/landkreis/jugend-und-familie/koja/"
            target="_blank"
            rel="noopener"
            class="mt-4 inline-block text-sm font-semibold underline"
          >
            weilheim-schongau.de/koja
          </a>
        </div>
      </div>
    </section>

    <!-- Closing / meta -->
    <section ref="metaTarget" class="reveal mt-16 border-t border-border pt-8" :class="{ 'is-visible': metaVisible }">
      <div class="grid gap-8 text-sm text-text-muted md:grid-cols-2">
        <div>
          <p class="mb-1.5 text-xs font-bold uppercase tracking-[0.16em] text-moss-dark">Verantwortlich</p>
          <p>
            Sebastian Esser &ndash; Kreisjugendring Weilheim-Schongau<br />
            Herbert Haseitl &ndash; Kreisjugendring Weilheim-Schongau
          </p>
        </div>
        <div>
          <p class="mb-1.5 text-xs font-bold uppercase tracking-[0.16em] text-moss-dark">Technik</p>
          <p>
            Diese Seite befindet sich im Aufbau und verwendet quelloffene Bibliotheken. Der Quelltext ist
            veröffentlicht auf
            <a href="https://github.com/seb-esser/K3Plattform" target="_blank" rel="noopener" class="underline"
              >GitHub</a
            >.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useReveal } from '../composables/useReveal';

const { target: whatTarget, visible: whatVisible } = useReveal();
const { target: trainTarget, visible: trainVisible } = useReveal();
const { target: metaTarget, visible: metaVisible } = useReveal();
</script>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
