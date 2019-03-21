<template>
    <div class="User" v-if="show">
        <div class="create-div">
            <b-button variant="primary" @click="onShowCreateUpdateUser">Criar novo usuário</b-button>

            <div v-if="isCreateUpdateUser">
                <CreateUpdateUser
                    class="create-div"
                    @createNewUser="onCreateNewUser"
                    @userIsEdited="onUserIsEdited"
                    @closeCreateUpdateUser="onCloseCreateUpdateUser"
                    ref="createUserElement"
                    v-bind:visible="isCreateUpdateUser" :userEditData="userEditData" :createUpdateUserTitle="createUpdateUserTitle"
                />  
            </div>
        </div>

        <p></p>

        <b-table
            striped
            hover
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
                {{ row.value ? 'sim' : 'não' }}
            </template>

            <template slot="actions" slot-scope="row">
                <div style="text-align: center"> 
                    <b-button size="sm" @click="onEditUserClick(row.item)" class="button" variant="info"> Editar </b-button>
                    <div class="divider" />
                    <b-button size="sm" @click="onDeleteUserClick(row.item._id)" class="button" variant="danger"> Deletar </b-button>
                    <div class="divider" />
                    <b-button size="sm" @click="onModifyActiveClick(row.item)" class="button" variant="danger">
                        {{ row.item.active ? 'Desativar' : 'Ativar' }}
                    </b-button>
                </div>
            </template>
        </b-table>
    </div>
</template>


<script>
import axios from 'axios';
import CreateUpdateUser from './CreateUpdateUser';

export default {
    name: "Users",
    components: { CreateUpdateUser },
    data() {
        return {
            show: true,
            isCreateUpdateUser: false,
            createUpdateUserTitle: 'Criar novo usuário.',
            sortBy: 'name',
            sortDesc: false,
            fields: [
                {key: 'name', sortable: true, label: 'Nome'},
                {key: 'cpf', sortable: true, label: 'CPF'},
                {key: 'cnpj', sortable: true, label: 'CNPJ'},
                {key: 'active', label: 'Ativo'},
                {key: 'actions', sortable: false, label: 'Ações'}
            ],
            users: [],
            userEditData: {
                _id: '',
                name: '',
                cpf: '',
                cnpj: ''
            }
        }
    },
    methods: {
        onCloseCreateUpdateUser() {
            this.isCreateUpdateUser = false;
            this.createUpdateUserTitle = 'Criar novo usuário.';
        },

        onShowCreateUpdateUser() {
            this.isCreateUpdateUser = true;
        },


        onCreateNewUser(userData) {
            this.users.push(userData);
            // TO-DO: notificar usuário da criação bem sucedida
        },

        onUserIsEdited() {
            axios.get('http://localhost:3000/api/v1/users')
                .then(res => { this.users = res.data.users })
                .catch(err => { throw new Error(err) });
            
            // TO-DO: notificar usuário da edição bem sucedida
        },

        onEditUserClick(userData) {
            const {_id, name, cpf, cnpj } = userData;

            this.userEditData._id = _id;
            this.userEditData.name = name;
            this.userEditData.cpf = cpf;
            this.userEditData.cnpj = cnpj;

            this.createUpdateUserTitle = 'Alterar usuário.'
            this.isCreateUpdateUser = true;
        },

        isDeactive(item) {
            if (!item.active)
                item._rowVariant = 'danger';
            return item
        },

        onDeleteUserClick(userId) {
            axios.delete(`http://localhost:3000/api/v1/users/${userId}`)
                .then(this.users = this.users.filter(user => user._id !== userId))
                .catch(err => { throw new Error(err) })
        },

        onModifyActiveClick(userData) {
            axios({
                method: 'patch',
                url: `http://localhost:3000/api/v1/users/${userData._id}`,
                data: {
                    active: !userData.active
                },
                headers: { 'Content-Type': 'application/json' }
            })
                .then(function(response) {
                    console.log('active alter to: ' + response.data.user.active)
                    userData.active = response.data.user.active;
                })
                .catch(function(error){
                    console.log('erro altering active: ' + error.response.data.error)
                })
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
