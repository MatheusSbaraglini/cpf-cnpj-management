<template>
    <div class="User" v-if="show">
        <div class="alert-div">
            <b-alert
                variant="success"
                fade
                dismissible
                :show="dismissSuccessCountDown"
                @dismiss-count-down="countDownSuccessChange"
                @dismissed="dismissSuccessCountDown=0"
            >
                <strong> {{ alertMessage }} </strong>
            </b-alert>

            <b-alert
                variant="danger"
                fade
                :show="dismissErrorCountDown"
                @dismiss-count-down="countDownErrorChange"
                @dismissed="dismissErrorCountDown=0"
            >
                <strong> {{ alertMessage }} </strong>
            </b-alert>
        </div>

        <div class="search-div">
            <b-form-group
                label-cols-sm="2"
                label="Filtro"
                class="mb-0"
                label-align-sm="right"
            >
                <b-input-group>
                    <b-form-input
                        v-model="filter"
                        placeholder="Digite sua pesquisa"
                    />
                    <b-input-group-append>
                        <b-button :disabled="!filter" @click="filter = ''"
                        >
                            Limpar
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-form-group>
        </div>

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

        <b-table
            striped
            hover
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :items="users"
            :fields="fields"
            :filter="filter"
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
            filter: '',
            alertMessage: '',
            dismissSuccessCountDown: 0,
            dismissErrorCountDown: 0,
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
            this.showSuccessAlert('Usuário foi criado com sucesso!');
        },

        onUserIsEdited() {
            axios.get('http://localhost:3000/api/v1/users')
                .then(function(response) {
                    this.users = response.data.users;
                    this.showSuccessAlert('Usuário foi alterado com sucesso!');
                }.bind(this))
                .catch(err => { throw new Error(err) });
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
                .then(function() {
                    this.users = this.users.filter(user => user._id !== userId);
                    this.showSuccessAlert('Usuário foi removido com sucesso!');
                }.bind(this))
                .catch(function() {
                    this.showErrorAlert('Houve uma falha ao remover o usuário');
                }.bind(this))
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
                    // console.log('active alter to: ' + response.data.user.active);
                    userData.active = response.data.user.active;
                    const activeOrDeactive = userData.active ? 'ativado' : 'desativado';
                    this.showSuccessAlert(`Usuário foi ${activeOrDeactive} com sucesso!`);
                }.bind(this))
                .catch(function(){
                    // console.log('erro altering active: ' + userData.active);
                    const activeOrDeactive = userData.active ? 'desativar' : 'ativar';
                    this.showErrorAlert(`Houve uma falha ao ${activeOrDeactive} o usuário!`);
                }.bind(this))
        },

        showSuccessAlert(message) {
            this.alertMessage = message;
            this.dismissSuccessCountDown = 2;
        },

        showErrorAlert(message) {
            this.alertMessage = message;
            this.dismissErrorCountDown = 2;
        },

        countDownSuccessChange(dismissCountDown) {
            this.dismissSuccessCountDown = dismissCountDown
        },

        countDownErrorChange(dismissCountDown) {
            this.dismissErrorCountDown = dismissCountDown;
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
        .catch(function() {
            this.showErrorAlert('Houve uma falha ao carregar todos usuários!');
        }.bind(this));
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
        float: right;
        margin-right: 1%;
        margin-bottom: 1%;
    }

    .search-div {
        float: left;
        margin-right: 10px;
        margin-bottom: 1%;
    }

    .parent-div {
        float: right;
        clear: none; 
    }

    .alert-div {
        width: 40%;
        margin: auto;
    }

</style>
