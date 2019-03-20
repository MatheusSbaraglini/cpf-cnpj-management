<template>
    <div class="User">
        <NewUser class="create-div" @createNewUser="onCreateNewUser"/>

        <p></p>

        <b-table striped hover
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :items="users"
            :fields="fields"
        >
            <template slot="cpf" slot-scope="row">
                {{ applyCpfMask(row.value) }}
            </template>

            <template slot="cnpj" slot-scope="row">
                {{ applyCnpjMask(row.value) }}
            </template>

            <template slot="active" slot-scope="row">
                {{ row.value ? 'yes' : 'no' }}
            </template>

            <template slot="actions" slot-scope="row">
                <div style="text-align: center"> 
                    <b-button size="sm" @click="deleteUser(row.item._id)" class="button" variant="info"> Edit </b-button>
                    <div class="divider" />
                    <b-button size="sm" @click="deleteUser(row.item._id)" class="button" variant="danger"> Delete </b-button>
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
import NewUser from './NewUser';

export default {
    name: "Users",
    components: { NewUser },
    data() {
        return {
            info: '',
            sortBy: 'name',
            sortDesc: false,
            fields: [
                {key: 'name', sortable: true},
                {key: 'cpf', sortable: true},
                {key: 'cnpj', sortable: true},
                {key: 'active'},
                {key: 'actions', sortable: false}
            ],
            users: []
        }
    },
    methods: {
        onCreateNewUser(userData){
            axios({
                method: 'post',
                url: 'http://localhost:3000/api/v1/users',
                data: {
                    name: userData.name,
                    cpf: userData.cpf,
                    cnpj: userData.cnpj
                },
                headers: { 'Content-Type': 'application/json'}
            })
                .then(function(response) {
                    console.log('response.data: ' + response.data.user);
                    this.users.push(response.data.user)
                })
                .catch(function(error){
                    console.log(error.response.data.error);
                })
        },

        isDeactive(item) {
            if (!item.active)
                item._rowVariant = 'danger';
            return item
        },

        deleteUser(userId){
            axios.delete(`http://localhost:3000/api/v1/users/${userId}`)
                .then(this.users = this.users.filter(user => user._id !== userId))
                .catch(err => { throw new Error(err) })
        },

        applyCpfMask(value) {
            return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g,"$1.$2.$3-$4");
        },

        applyCnpjMask(value) {
            return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,"$1.$2.$3/$4-$5");
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
    .divider {
        width:5px;
        height:auto;
        display:inline-block;
    }

    .create-div {
        text-align: right;
        margin-right: 5%;
        
    }

</style>
