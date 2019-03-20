<template>
    <div class="NewUser">
        <div>
            <b-button v-b-modal.newUser variant="primary">Create new user</b-button>

            <b-modal ref="newUser" id="newUser" title="Create a new user" centered size="sm" hide-footer >
                <div class="form-group">
                    <input
                        v-model="userData.name"
                        type="text"
                        class="form-control ml-sm-0"
                        placeholder="name"
                        :state="nameValidation"
                    />
                    <b-form-invalid-feedback :state="nameValidation">
                        Enter at least 1 letter.
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
                        Must be 11 characters long for cpf or 14 characters long for cnpj.
                    </b-form-invalid-feedback>
                </div>
                
                <!-- <div class="form-group">
                    <the-mask
                        mask="###.###.###-##"
                        v-model="userData.cpf"
                        class="form-control ml-sm-0"
                        placeholder="cpf"
                        :state="cpfValidation"
                    />
                    <b-form-invalid-feedback :state="cpfValidation">
                        Your cpf must be 11 characters long.
                    </b-form-invalid-feedback>
                </div>

                <div class="form-group">
                    <the-mask
                        mask="##.###.###/####-##"
                        v-model="userData.cnpj"
                        class="form-control ml-sm-0"
                        placeholder="cnpj"
                        :state="cnpjValidation"
                    />
                    <b-form-invalid-feedback :state="cnpjValidation">
                        Your cnpj must be 14 characters long.
                    </b-form-invalid-feedback>
                </div> -->

                <b-col>
                    <b-button variant="success" block @click="onCreateNewUser">Create</b-button>
                    <b-button variant="danger" block @click="hideModal">Cancel</b-button>
                </b-col>

            </b-modal>
        </div>
    </div>
</template>

<script>
export default {
    name: "NewUser",
    data() {
        return {
            userData: {
                name: '',
                cpf: '',
                cnpj: ''
            },
            cpfCnpj: ''
        }
    },
    methods: {
        hideModal(){
            this.cpfCnpj = '';
            this.userData.name = '';
            this.userData.cpf = '';
            this.userData.cnpj = '';

            this.$refs.newUser.hide();
        },
        onCreateNewUser() {
            this.userData.cpf = undefined;
            this.userData.cnpj = undefined;

            if (!this.userData.name.length > 0) {
                alert('Enter at least 1 letter.');
                return;
            }

            if (this.cpfCnpj.length !== 11 && this.cpfCnpj.length !== 14) {
                alert('Must be 11 characters long for cpf or 14 characters long for cnpj.');
                return;
            }

            this.cpfCnpj.length === 11 ? this.userData.cpf = this.cpfCnpj : this.userData.cnpj = this.cpfCnpj;

            this.$emit('createNewUser', this.userData);

            this.hideModal();
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
