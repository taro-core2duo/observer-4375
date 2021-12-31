<script>
    import Router from 'svelte-spa-router';

    import Ver2 from './ver2.0.svelte'
    import Read_me from './read_me.svelte'

    const routes = {
    '/ver2': Ver2,
    '/read_me': Read_me,
		'*': Ver2,
    };
</script>

<Router routes={routes}/>