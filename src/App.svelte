<script>
    import Router from 'svelte-spa-router';

    import Home from "./home.svelte"

    const routes = {
		'/home': Home,
		'*': Home,
    };
</script>

<Router routes={routes}/>