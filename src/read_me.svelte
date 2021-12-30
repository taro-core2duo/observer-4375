<script>
    import { read_me } from "./stores"

    const close_read_me = () => {
        read_me.set(false)
    }

    export function clickOutside(node) {
  
    const handleClick = event => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(
                new CustomEvent('click_outside', node)
            )
        }
    }

    document.addEventListener('click', handleClick, true);

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
            }
        }
    }
</script>

<div class="parent">
    <div class="child" use:clickOutside on:click_outside={close_read_me}>
        <embed src="observer_4375.pdf" type="application/pdf" width="90%" height="90%" class="pdf">
    </div>
</div>


<style>
    .parent{
        height:100vh;
        width:100vw;
        background:rgba(100, 100, 100, 0.5);
        z-index:1000;
        position:fixed;
        top:0;
        left:0;
    }
    .child{
        position:absolute;
        top:50%;
        left:50%;
        -webkit-transform : translate(-50%,-50%) rotateY(0deg);
        transform : translate(-50%,-50%) rotateY(0deg);
        -webkit-transition: transform .3s cubic-bezier(0.215, 0.61, 0.355, 1);
        transition:transform .3s cubic-bezier(0.215, 0.61, 0.355, 1);
        background-color: #ffffff;
        width:80%;
        height:80%;
        padding:20px;
        z-index:20000;
    }
    .pdf{
        position:absolute;
        top:50%;
        left:50%;
        -webkit-transform : translate(-50%,-50%) rotateY(0deg);
        transform : translate(-50%,-50%) rotateY(0deg);
    }
</style>