<template>
    <div class="CreateUpdateUser">
        <div>
            <b-modal
                ref="CreateUpdateUser"
                visible="visible"
                id="CreateUpdateUser"
                :title="createUpdateUserTitle"
                centered
                size="sm"
                hide-footer
                hide-header-close
                @hide="hideModal"
            >
                <div class="form-group">
                    <input
                        v-model="userData.name"
                        type="text"
                        class="form-control ml-sm-0"
                        placeholder="name"
                        :state="nameValidation"
                    />
                    <b-form-invalid-feedback :state="nameValidation">
                        Deve conter ao menos uma letra.
                    </b-form-invalid-feedback>
                </div>

                <div class="form-group">
                    <the-mask
                        :mask="['###.###.###-##', '##.###.###/####-##']"
                        v-model="cpfCnpj"
                        class="form-control ml-sm-0"
                        placeholder="cpf/cnpj"
                        :state="cpfCnpjValidation"
                    />
                    <b-form-invalid-feedback :state="cpfCnpjValidation">
                        Deve possuir 11 caracteres para CPF ou 14 caracteres para CNPJ
                    </b-form-invalid-feedback>
                </div>

                <div v-if="error">
                    <ErrorModalMessage
                        v-bind:visible="error" :errorMessage="errorMessage"
                        @onCloseErrorModalMessage="onCloseErrorModalMessage"
                    />
                </div>

                <b-col>
                    <b-button variant="success" block @click="onSaveClick">{{userData._id ? 'Alterar' : 'Cadastrar'}}</b-button>
                    <b-button variant="danger" block @click="onCancelClick">Cancelar</b-button>
                </b-col>

            </b-modal>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import ErrorModalMessage from './ErrorModalMessage';

export default {
    name: "CreateUpdateUser",
    components: {
        ErrorModalMessage
    },
    data() {
        return {
            userData: {
                _id: '',
                name: '',
                cpf: '',
                cnpj: ''
            },
            cpfCnpj: '',
            error: false,
            errorMessage: ''
        }
    },
    created(){
        if (this.userEditData) {
            this.userData = this.userEditData;
            this.cpfCnpj = this.userData.cpf ? this.userData.cpf : this.userData.cnpj;
        }
    },
    props: ["visible", "userEditData", "createUpdateUserTitle"],
    methods: {
        showError(message) {
            this.error = true;
            this.errorMessage = message;
        },

        onCloseErrorModalMessage(){
            this.error = false;
            this.errorMessage = '';
        },

        editUser(userId) {
            let data = {
                name: this.userData.name,
                cpf: this.userData.cpf,
                cnpj: this.userData.cnpj
            };
            console.log('name: ' + data.name);
            console.log('cpf: ' + data.cpf);
            console.log('cnpj: ' + data.cnpj);

            axios({
                method: 'put',
                url: `http://localhost:3000/api/v1/users/${userId}`,
                data: data,
                headers: { 'Content-Type': 'application/json'}
            })
                .then(function(response) {
                    console.log('put ok: ' + response.data.user.name);
                    this.$emit('userIsEdited');
                    this.hideModal();
                }.bind(this))
                .catch(function(error){
                    this.showError(error.response.data.error)
                }.bind(this))
        },

        createUser() {
            let data = {
                name: this.userData.name,
                cpf: this.userData.cpf,
                cnpj: this.userData.cnpj
            };

            axios({
                method: 'post',
                url: 'http://localhost:3000/api/v1/users',
                data: data,
                headers: { 'Content-Type': 'application/json'}
            })
                .then(function(response) {
                    console.log('post ok: ' + response.data.user.name);
                    this.$emit('createNewUser', response.data.user);
                    this.hideModal();
                }.bind(this))
                .catch(function(error){
                    this.showError(error.response.data.error)
                }.bind(this))
        },

        hideModal(){
            this.cpfCnpj = '';
            this.userData._id = '';
            this.userData.name = '';
            this.userData.cpf = '';
            this.userData.cnpj = '';

            this.$emit('closeCreateUpdateUser');
        },

        onCancelClick() {
            this.hideModal();
        },

        onSaveClick() {
            this.userData.cpf = undefined;
            this.userData.cnpj = undefined;

            if (!this.userData.name.length > 0) {
                this.showError('Enter at least 1 letter.');
                return;
            }

            if (this.cpfCnpj.length !== 11 && this.cpfCnpj.length !== 14) {
                this.showError('Must be 11 characters long for cpf or 14 characters long for cnpj.');
                return;
            }

            this.cpfCnpj.length === 11 ? this.userData.cpf = this.cpfCnpj : this.userData.cnpj = this.cpfCnpj;

            if (this.userData._id) {
                this.editUser(this.userData._id);
            } else {
                this.createUser();
            }
        }
    },
    computed: {
        nameValidation() {
            return this.userData.name.length > 0;
        },

        cpfCnpjValidation(){
            return (this.cpfCnpj.length === 11 || this.cpfCnpj.length === 14);
        }
    }
};
</script>

<style scoped>

</style>
