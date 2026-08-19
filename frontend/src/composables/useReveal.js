import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useReveal(threshold = 0.15) {
  const target = ref(null);
  const visible = ref(false);
  let observer;

  onMounted(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !target.value) {
      visible.value = true;
      return;
    }
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible.value = true;
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(target.value);
  });

  onBeforeUnmount(() => observer?.disconnect());

  return { target, visible };
}
