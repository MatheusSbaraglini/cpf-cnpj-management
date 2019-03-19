<template>
    <div class="User">
        <b-table striped hover :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :items="users" :fields="fields">
            <template slot="cpf" slot-scope="props">
                {{ props.item.cpf }}
            </template>

            <template slot="cnpj" slot-scope="props">
                {{ props.item.cnpj }}
            </template>

            <template slot="actions" slot-scope="props">
                <div style="text-align: center"> 
                    <b-button size="sm" @click="deleteUser(props.item._id)" class="button" variant="info"> Edit </b-button>
                    <div class="divider" />
                    <b-button size="sm" @click="deleteUser(props.item._id)" class="button" variant="danger"> Delete </b-button>
                </div>
            </template>
        </b-table>

        <div>
            Sorting By: <b>{{ sortBy }}</b>, Sort Direction:
            <b>{{ sortDesc ? 'Descending' : 'Ascending' }}</b>
        </div>
        <!-- {{ users }} -->
        info: {{info}}
    </div>
</template>


<script>
import axios from 'axios';

export default {
    name: "Users",
    data() {
        return {
            info: '',
            sortBy: 'name',
            sortDesc: false,
            fields: [
                {key: 'name', sortable: true},
                {key: 'cpf', sortable: true},
                {key: 'cnpj', sortable: true},
                {key: 'actions', sortable: false}
            ],
            users: []
        }
    },
    methods: {
        deleteUser(userId){
            axios.delete(`http://localhost:3000/api/v1/users/${userId}`)
                .then(res => {
                    this.users = this.users.filter(user => user._id !== userId);
                })
                .catch(err => { throw new Error(err) })
        }
    },
    created() {
      axios.get('http://localhost:3000/api/v1/users')
        .then(res => { this.users = res.data.users })
        .catch(err => { throw new Error(err) });
  }
}
</script>


<style scoped>
    .divider{
        width:5px;
        height:auto;
        display:inline-block;
    }

</style>
