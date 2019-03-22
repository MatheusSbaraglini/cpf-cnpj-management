<template>
    <div class="Status">
        <div>
            <strong> Quantidade de requests: </strong> {{ requests }}
            <br>
            <strong> uptime do servidor: </strong> {{ uptime }}
            <br>
        </div>

        <b-button variant="primary" href="#/">Voltar</b-button>
    </div>
</template>


<script>
import axios from 'axios';

export default {
    name: 'Status',
    data() {
        return {
            requests: 0,
            uptime: ''
        }
    },
    created() {
        axios.get('http://localhost:3000/api/v1/status')
            .then(function(response) {
                this.requests = response.data.requests;
                this.uptime = response.data.uptime;
            }.bind(this));
    }
}
</script>


<style scoped>

</style>
