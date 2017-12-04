<template>
	<div id="app">
	  <router-view></router-view>
	</div>
</template>

<script>

	export default {
		name: 'app',
		data() {
			return {}
		},
    created: function() {},
		mounted: function() {
		},
		watch: {
			'$route' (to, from) {
			}
		}
	}
</script>
<style lang="scss">
html, body, div, span,
h1, h2, h3, h4, h5, h6, p,
dl, dt, dd, ol, ul, li,
 {
    margin:0;
    padding:0;
    border:0;
    outline:0;
    vertical-align:baseline;
    background:transparent;
}
h1,h2,h3,h4,h5,h6,em,i {
    font-weight: 100;
    font-style: normal
}
ul,ol,li {
    list-style-type: none
}
a {
    color: #666;
    text-decoration: none;
    outline: 0
}
a:hover {
    text-decoration: none
}
</style>
