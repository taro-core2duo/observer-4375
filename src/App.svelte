<script>
    import Router from 'svelte-spa-router';

    import Home from "./home.svelte"
    import Ver2 from './ver2.0.svelte'
    import Read_me from './read_me.svelte'

    const routes = {
		'/home': Home,
    '/ver2': Ver2,
    '/read_me': Read_me,
		'*': Ver2,
    };
</script>

<Router routes={routes}/>