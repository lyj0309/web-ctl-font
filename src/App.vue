<template>
  <div class="title">
    网络继电器控制系统
  </div>
  <!--  <a-button class="log" type="primary">
      查看日志
    </a-button>-->
  <div class="list">
    <a-spin v-if="!items"/>
    <div v-for="item in items" v-bind:key="item.ip" class="item">
      <div class="name">{{ item.Name }}</div>
      <div class="ip">{{ item.Ip }}</div>
      <div class="state inline"/>
      <a-switch class="switch" checked-children="开" un-checked-children="关" v-model:checked="item.State"
                @change="onChange"/>
      <br>
      <br>
      <a-button @click="showModal">命令行</a-button>

    </div>
  </div>
  <!-- 命令行 -->
  <div>
    <a-modal v-model:visible="visible" title="CMD"
             width="100%"
             wrapClassName="full-modal"
    >
      <div style="    font-size: 1.1rem;line-height:1.5rem;  " v-html="cmdData+'▇'"></div>
    </a-modal>
  </div>
</template>

<script>
import {message} from 'ant-design-vue';
import "./index.css"
import {ref} from "vue";

export default {
  name: 'App',
  components: {},
  setup() {

    const visible = ref(false);
    const cmdData= ref("");

    const showModal = () => {
      cmdData.value = ""
      let ws = new WebSocket('ws://127.0.0.1:8083/cmd');

      document.onkeypress = event => {
        ws.send(event.key);
      };


      ws.onopen = () => {
        console.log('Connection open success');
      };

      ws.onmessage = function (evt) {
        if ( evt.data === "Enter") {
          cmdData.value += "<br>"
        } else {
          cmdData.value +=  evt.data
        }
        console.log('Received Message: ' + evt.data);
        // ws.close();
      };

      ws.onclose = function () {
        console.log('Connection closed.');
      };
      visible.value = true;

    };

    const handleOk = e => {
      console.log(e);
      visible.value = false;
    };

    return {
      cmdData,
      visible,
      showModal,
      handleOk,
    }
  },
  data() {
    return {
      items: [],
    };
  },
  beforeCreate() {

    fetch('http://127.0.0.1:8083/list')
        .then(response => response.json())
        .then(json => {
          console.log(json)
          // this.items.join(json)
          this.items = json
        })
        .catch(err => console.log('Request Failed', err));
  },
  methods: {
    success() {
      message.success('成功');
    },
    error() {
      message.error('This is an error message');
    },
    onChange(checked) {
      console.log(checked)
    },
  },
}
</script>
<style lang="less">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }

  .ant-modal-content {
    color: white;
    background-color: black;
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }

  .ant-modal-body {
    flex: 1;
  }
}
</style>