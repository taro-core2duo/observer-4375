<script>
    import Router from 'svelte-spa-router';

    import Home from "./home.svelte"
    import Ver2 from './ver2.0.svelte'

    const routes = {
		'/home': Home,
    '/ver2': Ver2,
		'*': Ver2,
    };
</script>

<Router routes={routes}/>