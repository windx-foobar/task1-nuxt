<script>
import Cookies from 'js-cookie';

export default {
  functional: true,
  render(createElement, context) {
    var data = {
      props: {
        name: 'sh-debug',
        css: false,
      },
      style: { background: 'rgb(255 235 59 / 35%)' },
    };
    const debug = Cookies.get('app.debug');
    const isDev = ['development', 'preproduction'].includes(process.env.NODE_ENV);
    const env = process.env.DISABLE_DEBUG;

    return createElement('div', data, (debug || isDev) && !env ? context.children : []);
  },
};
</script>
