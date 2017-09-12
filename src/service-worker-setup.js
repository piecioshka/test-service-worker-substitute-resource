// const SERVICE_WORKER_URL = 'service-worker-cache.js';
const SERVICE_WORKER_URL = 'service-worker-substitute.js';

function listen(reg, label) {
    console.log('[%s]:', label, reg);

    reg.addEventListener('statechange', () => {
        console.log('[%s]: state changed', label, reg.state);
    });
    reg.addEventListener('udpatefound', () => {
        console.log('[%s]: update found', label, arguments);
    });
    reg.addEventListener('controllerchange', (ctrl) => {
        console.log('[%s]: controller change', label, ctrl);
    });
}

async function bootstrap() {
    const reg = await navigator.serviceWorker.register(SERVICE_WORKER_URL)
    listen(reg, 'registration (Promise)');

    if (navigator.serviceWorker.controller) {
        listen(navigator.serviceWorker.controller, 'navigator.serviceWorker.controller');
    }

    if (navigator.serviceWorker) {
        listen(navigator.serviceWorker, 'navigator.serviceWorker');
    }
}

bootstrap().catch((err) => console.error(err));
