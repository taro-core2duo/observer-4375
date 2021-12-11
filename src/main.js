import App from './App.svelte';
import 'leaflet/dist/leaflet.css';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;