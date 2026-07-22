<template>
  <div>
    <h1>K3 Plattform</h1>
    <h2 class="subheader">Ein Verbundprojekt von KJR und KoJa im Landkreis Weilheim Schongau</h2>

    <div class="prose">
      <p>
        Diese Plattform ist ein Prototyp, anhand dessen zukünftige Projektentwicklungen für die Jugendarbeit im
        Landkreis Weilheim Schongau entwickelt und gestestet werden sollen.
      </p>
      <p>
        Der Fokus liegt zu Beginn auf der Bereistellung einer Koordinationsplattform, um die Verteilung von
        Informationen von und für Akteur:innen der Jugendarbeit im Landkreis zu verbessern.
      </p>
      <p>Verantwortlich:</p>
      <p>
        Sebastian Esser - Kreisjugendring Weilheim-Schongau<br />
        Herbert Haseitl - Kreisjugendring Weilheim-Schongau
      </p>
    </div>

    <div class="info-box">
      Diese Seite befindet sich im Aufbau und verwendet quelloffene Bibliotheken. Der zugehörige Quelltext ist hier
      veröffentlicht:
      <a href="https://github.com/seb-esser/K3Plattform" target="_blank" rel="noopener"
        >https://github.com/seb-esser/K3Plattform</a
      >
    </div>
  </div>
</template>

<style scoped>
.subheader {
  font-weight: 400;
  color: var(--color-text-muted);
  margin-top: 0;
}

.prose p {
  margin: 0 0 1rem;
}

.info-box {
  background: var(--color-surface-alt);
  border-left: 4px solid var(--color-primary-light);
  border-radius: var(--radius-sm);
  padding: 1rem 1.25rem;
  margin-top: 1.5rem;
}
</style>
